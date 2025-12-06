package com.venta.backend.venta.impl;

import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.enums.BranchType;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import com.venta.backend.venta.dto.response.VentaListadoResponse;
import com.venta.backend.venta.dto.response.VentaPaginadaResponse;
import com.venta.backend.venta.dto.response.VentasPorCanalResponse;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.VentaEstado;
import com.venta.backend.venta.mappers.IVentaMapper;
import com.venta.backend.venta.servicios.IVentaConsultaService;
import com.venta.backend.venta.repository.VentaRepositorio;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaConsultaServiceImpl implements IVentaConsultaService {

    private final VentaRepositorio ventaRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    @Qualifier("IVentaMapper")
    private final IVentaMapper ventaMapper;
    private final VendedorRepositorio vendedorRepositorio;

    @Override
    @Transactional(readOnly = true)
    public List<VentaListadoResponse> listarVentas() {
        return ventaRepositorio.findAll()
                .stream()
                .map(venta -> {
                    VentaListadoResponse response = ventaMapper.toListado(venta);
                    
                    // Cargar nombre del cliente si existe
                    if (venta.getClienteId() != null) {
                        String nombreCliente = clienteRepositorio.findById(venta.getClienteId())
                                .map(cliente -> cliente.getFirstName() + " " + cliente.getLastName())
                                .orElse(null);
                        
                        return VentaListadoResponse.builder()
                                .id(response.getId())
                                .numVenta(response.getNumVenta())
                                .origenVenta(response.getOrigenVenta())
                                .estado(response.getEstado())
                                .fechaVentaCreada(response.getFechaVentaCreada())
                                .nombreCliente(nombreCliente)
                                .build();
                    }
                    
                    return response;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VentaPaginadaResponse listarVentasPaginadas(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VentaListadoResponse> ventasPage = ventaRepositorio.findAll(pageable)
                .map(venta -> {
                    VentaListadoResponse response = ventaMapper.toListado(venta);
                    
                    // Cargar nombre del cliente si existe
                    if (venta.getClienteId() != null) {
                        String nombreCliente = clienteRepositorio.findById(venta.getClienteId())
                                .map(cliente -> cliente.getFirstName() + " " + cliente.getLastName())
                                .orElse(null);
                        
                        return VentaListadoResponse.builder()
                                .id(response.getId())
                                .numVenta(response.getNumVenta())
                                .origenVenta(response.getOrigenVenta())
                                .estado(response.getEstado())
                                .fechaVentaCreada(response.getFechaVentaCreada())
                                .nombreCliente(nombreCliente)
                                .build();
                    }
                    
                    return response;
                });

        return VentaPaginadaResponse.builder()
                .content(ventasPage.getContent())
                .pageNumber(ventasPage.getNumber())
                .pageSize(ventasPage.getSize())
                .totalElements(ventasPage.getTotalElements())
                .totalPages(ventasPage.getTotalPages())
                .first(ventasPage.isFirst())
                .last(ventasPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentasPorCanalResponse> obtenerVentasPorCanal() {

        // 1. Obtener todas las ventas CONFIRMADAS
        List<Venta> ventasConfirmadas = ventaRepositorio.findByEstado(VentaEstado.CONFIRMADA);

        // 2. Agrupar y clasificar en Java
        Map<String, List<Venta>> ventasPorCanal = ventasConfirmadas.stream()
                .filter(venta -> venta.getIdVendedor() != null) // Ignorar ventas sin vendedor asignado
                .collect(Collectors.groupingBy(venta -> {

                    // Buscar el vendedor y su sede (JOIN lógico)
                    Vendedor vendedor = vendedorRepositorio.findById(venta.getIdVendedor())
                            .orElse(null);

                    if (vendedor != null && vendedor.getSellerBranch() != null) {
                        BranchType type = vendedor.getSellerBranch().getBranchType();

                        if (type == BranchType.CALL_CENTER) {
                            return "LLAMADA";
                        } else {
                            // MÓDULO, CENTRO_DE_ATENCION, AUTHORIZED_DEALER se agrupan en FÍSICO
                            return "FISICO";
                        }
                    }
                    return "OTRO"; // Canal desconocido
                }));

        // 3. Mapear y calcular las métricas finales
        return ventasPorCanal.entrySet().stream()
                .map(entry -> {
                    String canal = entry.getKey();
                    Long cantidadVentas = (long) entry.getValue().size();
                    BigDecimal ingresosTotales = entry.getValue().stream()
                            .map(Venta::getTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return VentasPorCanalResponse.builder()
                            .canal(canal)
                            .cantidadVentas(cantidadVentas)
                            .ingresosTotales(ingresosTotales)
                            .build();
                })
                .collect(Collectors.toList());
    }
}




