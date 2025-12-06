package com.venta.backend.venta.dto.response;

import com.venta.backend.venta.enums.EstadoPago;
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
public class BoletaClienteResponse {
    private String numVenta;
    private LocalDate fechaBoleta;
    private BigDecimal montoBoleta;
    private Integer cantidadProductos;
    private EstadoPago estadoPago;
}
