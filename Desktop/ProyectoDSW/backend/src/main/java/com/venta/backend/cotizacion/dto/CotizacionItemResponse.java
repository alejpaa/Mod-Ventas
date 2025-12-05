package com.venta.backend.cotizacion.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class CotizacionItemResponse {
    Integer id;
    Long productoId;
    Integer cantidad;
    BigDecimal precioUnitario;
    BigDecimal descuentoMonto;
    BigDecimal subtotal;
}


