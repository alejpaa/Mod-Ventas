package com.venta.backend.venta.application.dto.response;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class LineaCarritoResponse {
    Long detalleId;
    Long itemProductoId;
    String nombreProducto;
    Integer cantidad;
    BigDecimal precioUnitario;
    BigDecimal subtotal;
}

