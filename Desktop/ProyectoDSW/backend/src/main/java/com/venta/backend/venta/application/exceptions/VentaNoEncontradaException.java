package com.venta.backend.venta.application.exceptions;

public class VentaNoEncontradaException extends RuntimeException {
    public VentaNoEncontradaException(Long ventaId) {
        super("Venta no encontrada con ID: " + ventaId);
    }
}

