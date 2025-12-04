package com.venta.backend.venta.application.dto.response;

import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
@Builder
public class VentaResumenResponse {
    Long ventaId;
    OrigenVenta origen;
    VentaEstado estado;
    BigDecimal subtotal;
    BigDecimal descuentoTotal;
    BigDecimal total;
    List<LineaCarritoResponse> items;
}

