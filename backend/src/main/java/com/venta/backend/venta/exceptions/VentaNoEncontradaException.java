package com.venta.backend.venta.exceptions;

public class VentaNoEncontradaException extends RuntimeException {
    public VentaNoEncontradaException(Long ventaId) {
        super("Venta no encontrada con ID: " + ventaId);
    }
}

