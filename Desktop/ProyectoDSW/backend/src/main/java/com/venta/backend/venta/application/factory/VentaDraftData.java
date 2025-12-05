package com.venta.backend.venta.application.factory;

import com.venta.backend.venta.enums.OrigenVenta;

public record VentaDraftData(
        OrigenVenta origen,
        String usuarioCreador
) {
}

