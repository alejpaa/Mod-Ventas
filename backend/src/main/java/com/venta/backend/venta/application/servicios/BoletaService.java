package com.venta.backend.venta.application.servicios;

import com.venta.backend.venta.application.dto.response.BoletaResponse;
import com.venta.backend.venta.entities.Boleta;
import com.venta.backend.venta.infraestructura.repository.BoletaRepositorio;
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
}
