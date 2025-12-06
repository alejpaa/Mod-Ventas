package com.venta.backend.venta.dto.response;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class VentasPorCanalResponse {
    String canal; // 'FISICO' o 'LLAMADA'
    Long cantidadVentas;
    BigDecimal ingresosTotales;
}