package com.venta.backend.cliente.application.impl;

import com.venta.backend.cliente.application.dto.request.CrearClienteSimpleRequest;
import com.venta.backend.cliente.application.dto.request.ModificacionClienteRequest;
import com.venta.backend.cliente.application.dto.request.RegistroClienteRequest;
import com.venta.backend.cliente.application.dto.response.*;
import com.venta.backend.cliente.application.exceptions.ClienteNoAptoException;
import com.venta.backend.cliente.application.exceptions.RecursoNoEncontradoException;
import com.venta.backend.cliente.application.exceptions.RegistroClienteException;
import com.venta.backend.cliente.application.mappers.IClienteMapeador;
import com.venta.backend.cliente.application.servicios.IClienteAdminServicio;
import com.venta.backend.cliente.application.servicios.IClienteConsultaServicio;
import com.venta.backend.cliente.application.specifications.ClienteEspecificacion;
import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.cliente.enums.EstadoClienteEnum;
import com.venta.backend.cliente.infraestructura.clientes.IClienteValidacion;
import com.venta.backend.cliente.infraestructura.clientes.IClienteVenta;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del patrón Facade para servicios de Cliente.
 * Implementa tanto IClienteAdminServicio como IClienteConsultaServicio.
 */
@Service
@RequiredArgsConstructor
public class ClienteServicioImpl implements IClienteAdminServicio, IClienteConsultaServicio {

    private final ClienteRepositorio clienteRepositorio;
    private final IClienteMapeador clienteMapeador;
    private final IClienteValidacion clienteValidacion;
    private final IClienteVenta clienteVenta;

    // ========== MÉTODOS DE ADMINISTRACIÓN ==========

    @Override
    @Transactional
    public ClienteResponse registrarCliente(RegistroClienteRequest request) {
        // Validar que el DNI no exista
        if (clienteRepositorio.existsByDni(request.getDni())) {
            throw new RegistroClienteException("Ya existe un cliente con el DNI: " + request.getDni());
        }

        // Validar que el email no exista (si se proporciona)
        if (request.getEmail() != null && !request.getEmail().isBlank() 
                && clienteRepositorio.existsByEmail(request.getEmail())) {
            throw new RegistroClienteException("Ya existe un cliente con el email: " + request.getEmail());
        }

        // Validar elegibilidad del cliente (HU-01, Escenario 2)
        if (!clienteValidacion.esClienteApto(request.getDni())) {
            String motivo = clienteValidacion.obtenerMotivoRestriccion(request.getDni());
            throw new ClienteNoAptoException(motivo);
        }

        // Crear la entidad Cliente
        Cliente nuevoCliente = Cliente.builder()
                .dni(request.getDni())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .registrationDate(LocalDate.now())
                .estado(EstadoClienteEnum.ACTIVO)
                .categoria("Estándar") // Categoría inicial
                .build();

        Cliente clienteGuardado = clienteRepositorio.save(nuevoCliente);

        return clienteMapeador.toClienteResponse(clienteGuardado);
    }

    @Override
    @Transactional
    public ClienteResponse actualizarCliente(Long clienteId, ModificacionClienteRequest request) {
        Cliente cliente = findClienteEntityById(clienteId);

        // Actualizar campos permitidos
        if (request.getLastName() != null) {
            cliente.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            // Validar que el email no esté en uso por otro cliente
            if (clienteRepositorio.existsByEmail(request.getEmail()) 
                    && !cliente.getEmail().equals(request.getEmail())) {
                throw new RegistroClienteException("Ya existe un cliente con el email: " + request.getEmail());
            }
            cliente.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            cliente.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            cliente.setAddress(request.getAddress());
        }
        if (request.getEstado() != null) {
            cliente.changeStatus(request.getEstado());
        }

        Cliente clienteActualizado = clienteRepositorio.save(cliente);

        return clienteMapeador.toClienteResponse(clienteActualizado);
    }

    @Override
    @Transactional
    public ClienteIdResponse crearClienteSimple(CrearClienteSimpleRequest request) {
        // Validar que el DNI no exista
        if (clienteRepositorio.existsByDni(request.getDni())) {
            Cliente clienteExistente = clienteRepositorio.findByDni(request.getDni())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado"));
            return ClienteIdResponse.builder()
                    .clienteId(clienteExistente.getClienteId())
                    .build();
        }

        // Validar elegibilidad básica
        if (!clienteValidacion.esClienteApto(request.getDni())) {
            String motivo = clienteValidacion.obtenerMotivoRestriccion(request.getDni());
            throw new ClienteNoAptoException(motivo);
        }

        // Crear cliente simplificado
        Cliente nuevoCliente = Cliente.builder()
                .dni(request.getDni())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .registrationDate(LocalDate.now())
                .estado(EstadoClienteEnum.ACTIVO)
                .categoria("Estándar")
                .build();

        Cliente clienteGuardado = clienteRepositorio.save(nuevoCliente);

        return ClienteIdResponse.builder()
                .clienteId(clienteGuardado.getClienteId())
                .build();
    }

    @Override
    @Transactional
    public void darBajaCliente(Long clienteId) {
        Cliente cliente = findClienteEntityById(clienteId);

        // Validar que no tenga deudas ni equipos pendientes (HU-05, Escenario 1)
        if (!clienteVenta.puedeDarBaja(clienteId)) {
            throw new RegistroClienteException(
                    "No se puede dar de baja: El cliente debe regularizar su estado (deuda o equipos)"
            );
        }

        cliente.changeStatus(EstadoClienteEnum.INACTIVO);
        clienteRepositorio.save(cliente);
    }

    // ========== MÉTODOS DE CONSULTA ==========

    @Override
    @Transactional(readOnly = true)
    public PageClienteResponse filtrarClientes(String filtro, EstadoClienteEnum estado, Pageable pageable) {
        Specification<Cliente> spec = ClienteEspecificacion.buildSpecification(filtro, estado);
        Page<Cliente> clientePage = clienteRepositorio.findAll(spec, pageable);

        List<ClienteResponse> clientesResponse = clientePage.getContent().stream()
                .map(clienteMapeador::toClienteResponse)
                .collect(Collectors.toList());

        return PageClienteResponse.builder()
                .clientes(clientesResponse)
                .currentPage(clientePage.getNumber())
                .totalPages(clientePage.getTotalPages())
                .totalElements(clientePage.getTotalElements())
                .pageSize(clientePage.getSize())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public HistorialComprasResponse obtenerHistorial(Long clienteId) {
        Cliente cliente = findClienteEntityById(clienteId);

        // TODO: En producción, esto consultaría el módulo de Ventas para obtener el historial real
        // Por ahora, retornamos una respuesta simulada
        HistorialComprasResponse response = HistorialComprasResponse.builder()
                .clienteId(cliente.getClienteId())
                .clienteNombre(cliente.getFullName())
                .categoria(cliente.getCategoria())
                .totalCompras(java.math.BigDecimal.ZERO)
                .cantidadCompras(0)
                .compras(List.of())
                .build();

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PageMarketingClienteResponse obtenerDatosParaMarketing(Pageable pageable) {
        Page<Cliente> clientePage = clienteRepositorio.findAll(pageable);

        List<PageMarketingClienteResponse.ClienteMarketingDTO> clientesMarketing = clientePage.getContent().stream()
                .map(cliente -> PageMarketingClienteResponse.ClienteMarketingDTO.builder()
                        .clienteId(cliente.getClienteId())
                        .dni(cliente.getDni())
                        .fullName(cliente.getFullName())
                        .email(cliente.getEmail())
                        .categoria(cliente.getCategoria())
                        .estado(cliente.getEstado().name())
                        .recencyScore(0) // TODO: Calcular desde historial de compras
                        .frequencyScore(0) // TODO: Calcular desde historial de compras
                        .monetaryScore(java.math.BigDecimal.ZERO) // TODO: Calcular desde historial de compras
                        .build())
                .collect(Collectors.toList());

        return PageMarketingClienteResponse.builder()
                .clientes(clientesMarketing)
                .currentPage(clientePage.getNumber())
                .totalPages(clientePage.getTotalPages())
                .totalElements(clientePage.getTotalElements())
                .pageSize(clientePage.getSize())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteVentaDTO buscarClienteParaVenta(String dni) {
        Cliente cliente = clienteRepositorio.findByDni(dni)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con DNI: " + dni));

        // Verificar si tiene deudas
        boolean tieneDeuda = clienteVenta.tieneDeudas(cliente.getClienteId());
        boolean puedeComprar = cliente.isActive() && !tieneDeuda;

        return ClienteVentaDTO.builder()
                .clienteId(cliente.getClienteId())
                .dni(cliente.getDni())
                .fullName(cliente.getFullName())
                .email(cliente.getEmail())
                .phoneNumber(cliente.getPhoneNumber())
                .estado(cliente.getEstado().name())
                .tieneDeuda(tieneDeuda)
                .puedeComprar(puedeComprar)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtenerClientePorId(Long clienteId) {
        Cliente cliente = findClienteEntityById(clienteId);
        return clienteMapeador.toClienteResponse(cliente);
    }

    // ========== MÉTODOS PRIVADOS AUXILIARES ==========

    private Cliente findClienteEntityById(Long clienteId) {
        return clienteRepositorio.findById(clienteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con ID: " + clienteId));
    }
}

