package com.venta.backend.venta.application.factory.impl;

import com.venta.backend.venta.application.factory.IVentaFactory;
import com.venta.backend.venta.application.factory.VentaDraftData;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class VentaDirectaFactory implements IVentaFactory {

    @Override
    public OrigenVenta origenSoportado() {
        return OrigenVenta.DIRECTA;
    }

    @Override
    public Venta crearVentaBorrador(VentaDraftData data) {
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

