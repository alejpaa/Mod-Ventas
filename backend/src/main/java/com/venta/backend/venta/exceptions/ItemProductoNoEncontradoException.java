package com.venta.backend.venta.exceptions;

public class ItemProductoNoEncontradoException extends RuntimeException {
    public ItemProductoNoEncontradoException(Long productoId) {
        super("Producto no encontrado con ID: " + productoId);
    }
}

