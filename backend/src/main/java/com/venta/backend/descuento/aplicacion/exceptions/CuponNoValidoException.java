package com.venta.backend.descuento.aplicacion.exceptions;

public class CuponNoValidoException extends RuntimeException {
    public CuponNoValidoException(String mensaje) {
        super(mensaje);
    }
}