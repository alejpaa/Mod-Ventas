package com.venta.backend.cotizacion.infraestructura.email.adapter;

/**
 * Exception thrown when email sending fails.
 */
public class EmailSendException extends RuntimeException {
    
    public EmailSendException(String message) {
        super(message);
    }
    
    public EmailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}
