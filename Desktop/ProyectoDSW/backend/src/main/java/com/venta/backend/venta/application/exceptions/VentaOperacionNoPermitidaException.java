package com.venta.backend.venta.application.exceptions;

public class VentaOperacionNoPermitidaException extends RuntimeException {
    public VentaOperacionNoPermitidaException(String message) {
        super(message);
    }
}

