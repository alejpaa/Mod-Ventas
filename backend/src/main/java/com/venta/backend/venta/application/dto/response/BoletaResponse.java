package com.venta.backend.venta.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoletaResponse {
    
    private Long idBoleta;
    private Long idVendedor;
    private Long idVenta;
    private String numVenta;
    private LocalDate fechaGeneracion;
    private BigDecimal montoVendido;
}
