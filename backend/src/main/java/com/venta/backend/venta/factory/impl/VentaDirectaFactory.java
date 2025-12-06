package com.venta.backend.venta.factory.impl;

import com.venta.backend.venta.factory.VentaFactory;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class VentaDirectaFactory implements VentaFactory {

    @Override
    public OrigenVenta origenSoportado() {
        return OrigenVenta.DIRECTA;
    }

    @Override
    public Venta crearVentaBorrador() {
        return Venta.builder()
                .origenVenta(OrigenVenta.DIRECTA)
                .estado(VentaEstado.BORRADOR)
                .fechaVentaCreada(LocalDate.now())
                .subtotal(BigDecimal.ZERO)
                .descuentoTotal(BigDecimal.ZERO)
                .total(BigDecimal.ZERO)
                .build();
    }
}

