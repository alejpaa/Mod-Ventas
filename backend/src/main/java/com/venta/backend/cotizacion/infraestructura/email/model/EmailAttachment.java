package com.venta.backend.cotizacion.infraestructura.email.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Represents an email attachment.
 */
@Getter
@AllArgsConstructor
public class EmailAttachment {
    
    private final byte[] content;
    private final String filename;
    private final String mimeType;
    
    public static EmailAttachment pdf(byte[] content, String filename) {
        return new EmailAttachment(content, filename, "application/pdf");
    }
}
