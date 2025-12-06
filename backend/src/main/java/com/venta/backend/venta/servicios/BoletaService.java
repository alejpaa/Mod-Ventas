package com.venta.backend.venta.servicios;

import com.venta.backend.venta.dto.response.BoletaResponse;
import com.venta.backend.venta.dto.response.BoletaClienteResponse;
import com.venta.backend.venta.entities.Boleta;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.repository.BoletaRepositorio;
import com.venta.backend.venta.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoletaService {

    private final BoletaRepositorio boletaRepositorio;
    private final VentaRepositorio ventaRepositorio;

    /**
     * Obtiene todas las boletas de un vendedor usando su employee_rrhh_id
     */
    public List<BoletaResponse> obtenerBoletasPorEmpleado(Long employeeRrhhId) {
        List<Boleta> boletas = boletaRepositorio.findBoletasByEmployeeRrhhId(employeeRrhhId);
        
        return boletas.stream()
                .map(boleta -> BoletaResponse.builder()
                        .idBoleta(boleta.getIdBoleta())
                        .idVendedor(boleta.getIdVendedor())
                        .idVenta(boleta.getVenta().getId())
                        .numVenta(boleta.getVenta().getNumVenta())
                        .fechaGeneracion(boleta.getFechaGeneracion())
                        .montoVendido(boleta.getMontoVendido())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las boletas de un cliente con información de la venta
     */
    public List<BoletaClienteResponse> obtenerBoletasPorCliente(Long clienteId) {
        List<Boleta> boletas = boletaRepositorio.findBoletasByClienteId(clienteId);
        
        return boletas.stream()
                .map(boleta -> {
                    Venta venta = boleta.getVenta();
                    
                    int cantidadProductos = venta != null && venta.getDetalles() != null 
                            ? venta.getDetalles().size() 
                            : 0;
                    
                    return BoletaClienteResponse.builder()
                            .numVenta(venta != null ? venta.getNumVenta() : null)
                            .fechaBoleta(boleta.getFechaGeneracion())
                            .montoBoleta(boleta.getMontoVendido())
                            .cantidadProductos(cantidadProductos)
                            .estadoPago(venta != null ? venta.getEstadoPago() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
