package com.venta.backend.vendedor.impl;

import com.venta.backend.vendedor.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.dto.response.VendedorResponse;
import com.venta.backend.vendedor.strategies.IEdicionVendedorStrategy;
import com.venta.backend.vendedor.strategies.IRegistroVendedorStrategy;
import com.venta.backend.vendedor.exceptions.RecursoNoEncontradoException;
import com.venta.backend.vendedor.exceptions.RegistroVendedorException;
import com.venta.backend.vendedor.factories.IStrategyFactory;
import com.venta.backend.vendedor.mappers.IVendedorMapeador;
import com.venta.backend.vendedor.services.IVendedorAdminService;
import com.venta.backend.vendedor.services.IVendedorConsultaService;
import com.venta.backend.vendedor.specifications.VendedorEspecificacion;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.enums.BranchType;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.enums.SellerType;
import com.venta.backend.vendedor.infraestructura.clientes.IClienteCotizacion;
import com.venta.backend.vendedor.infraestructura.clientes.IRrhhServiceSubject;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import com.venta.backend.vendedor.infraestructura.repository.SedeRepositorio;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendedorServicioImpl implements IVendedorAdminService, IVendedorConsultaService {
    private final VendedorRepositorio vendedorRepositorio;
    private final SedeRepositorio sedeRepositorio;
    private final IStrategyFactory fabricaStrategia;
    private final IVendedorMapeador vendedorMapeador;
    private final IClienteCotizacion clienteCotizacion;
    private final IRrhhServiceSubject clienteRRHH;

    @Override
    @Transactional
    public VendedorResponse createSeller(RegistroVendedorRequest request) {
        IRegistroVendedorStrategy strategia = fabricaStrategia.getRegistrationStrategy(request.getSellerType());

        if (request.getSellerBranchId() == null) {
            throw new RegistroVendedorException("Debe asignar una Sede de Venta.");
        }

        Sede sedeAsignada = findSedeEntityById(request.getSellerBranchId());

        strategia.validateData(request, sedeAsignada);

        validateBranchCapacity(sedeAsignada);

        Vendedor newVendedor = strategia.createSellerEntity(request);
        newVendedor.assignBranch(sedeAsignada);

        Vendedor savedVendedor = vendedorRepositorio.save(newVendedor);

        return vendedorMapeador.toVendedorResponse(savedVendedor); // Devolver dto en vez de la entidad
    }

    @Override
    @Transactional
    public VendedorResponse updateSeller(Long sellerId, ModificacionVendedorRequest request) {
        Vendedor vendedorToUpdate = findSellerEntityById(sellerId);

        IEdicionVendedorStrategy strategia = fabricaStrategia.getEditionStrategy(vendedorToUpdate.getSellerType());

        Sede newSede = null;
        Long newBranchId = request.getSellerBranchId();

        if (newBranchId != null && !newBranchId.equals(vendedorToUpdate.getSellerBranch().getBranchId())) {
            newSede = findSedeEntityById(newBranchId);
            validateBranchCapacity(newSede);
        }

        strategia.applyChanges(vendedorToUpdate, request, newSede);

        Vendedor updatedVendedor = vendedorRepositorio.save(vendedorToUpdate);

        return vendedorMapeador.toVendedorResponse(updatedVendedor);
    }

    @Override
    @Transactional
    public void deactivateSeller(Long sellerId) {
        log.info("Iniciando desactivación de vendedor ID: {}", sellerId);
        Vendedor vendedor = findSellerEntityById(sellerId);

        if (clienteCotizacion.hasPendingQuotations(sellerId)) {
            log.warn("Bloqueo de Baja: Vendedor ID {} tiene cotizaciones pendientes. Operación cancelada.", sellerId);
            throw new RegistroVendedorException("Acción bloqueada: El vendedor tiene cotizaciones pendientes.");
        }

        vendedor.changeStatus(SellerStatus.INACTIVE);
        vendedorRepositorio.save(vendedor);
        log.info("Vendedor ID {} dado de baja lógicamente (INACTIVE).", sellerId);
    }

    @Override
    @Transactional
    public VendedorResponse reactivateSeller(Long sellerId) {
        Vendedor vendedor = findSellerEntityById(sellerId);

        validateBranchCapacity(vendedor.getSellerBranch());

        vendedor.changeStatus(SellerStatus.ACTIVE);
        Vendedor reactivatedVendedor = vendedorRepositorio.save(vendedor);
        return vendedorMapeador.toVendedorResponse(reactivatedVendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendedorResponse findSellerById(Long sellerId) {
        Vendedor vendedor = findSellerEntityById(sellerId);

        if (vendedor.getSellerStatus() == SellerStatus.INACTIVE) {
            throw new RegistroVendedorException("El vendedor con ID " + sellerId
                    + "se encuentra inactivo y no puede realizar ventas");
        }

        return vendedorMapeador.toVendedorResponse(vendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendedorResponse findSellerByDni(String dni) {
        Vendedor vendedor = vendedorRepositorio.findByDni(dni)
                .orElseThrow(() -> new RecursoNoEncontradoException("Vendedor no encontrado con DNI: " + dni));
        return vendedorMapeador.toVendedorResponse(vendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendedorResponse> searchSellers(SellerType sellerType, SellerStatus sellerStatus,
                                                Long sellerBranchId, String dni, Pageable pageable) {
        //  Usar nuestro helper para construir la consulta dinámica
        Specification<Vendedor> spec = VendedorEspecificacion.buildSpecification(
                sellerType, sellerStatus, sellerBranchId, dni
        );

        //  Ejecutar la consulta con paginación
        Page<Vendedor> vendedorPage = vendedorRepositorio.findAll(spec, pageable);

        // Mapear la página de Entidades a una página de DTOs
        return vendedorPage.map(vendedorMapeador::toVendedorResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendedorResponse> listActiveSellers() {
        Specification<Vendedor> spec = VendedorEspecificacion.buildSpecification(null, SellerStatus.ACTIVE, null, null);
        List<Vendedor> activeSellers = vendedorRepositorio.findAll(spec);
        return vendedorMapeador.toVendedorResponseList(activeSellers);
    }


    private Vendedor findSellerEntityById(Long sellerId) {
        return vendedorRepositorio.findById(sellerId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Vendedor no encontrado con ID: " + sellerId));
    }

    private Sede findSedeEntityById(Long sedeId) {
        return sedeRepositorio.findById(sedeId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Sede no encontrada con ID: " + sedeId));
    }

    private void validateBranchCapacity(Sede sede) {
        if (sede.getBranchType() == BranchType.CALL_CENTER) {
            log.debug("Sede {} es CALL_CENTER, omitiendo chequeo de capacidad.", sede.getName());
            return;
        }

        Long currentSellers = vendedorRepositorio.countActiveSellersByBranch(sede.getBranchId());
        log.debug("Sede ID {}: Vendedores Activos Actuales: {} / Capacidad Máxima: {}",
                sede.getBranchId(), currentSellers, sede.getMaxCapacity());

        if (sede.getMaxCapacity() != null && currentSellers >= sede.getMaxCapacity()) {
            log.warn("Bloqueo de Capacidad: Sede ID {} ({}) ha alcanzado su límite.", sede.getBranchId(), sede.getName());
            throw new RegistroVendedorException(
                    "La sede ha alcanzado su capacidad máxima de vendedores ("
                            + sede.getMaxCapacity() + ")"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public VendedorResponse findSellerByEmployeeRrhhId(Long employeeRrhhId) {
        // Buscar por la columna de referencia
        Vendedor vendedor = vendedorRepositorio.findByEmployeeRrhhId(employeeRrhhId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Vendedor (interno) no encontrado con ID RRHH: " + employeeRrhhId
                ));

        // El DTO VendedorResponse ya contiene el sellerId (la llave primaria)
        return vendedorMapeador.toVendedorResponse(vendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpleadoRRHHDTO fetchRrhhEmployee(String dni) {
        // Llama directamente al cliente (que usa el mock o la llamada real)
        return clienteRRHH.getEmployeeByDni(dni)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado en RRHH con DNI: " + dni));
    }
}
