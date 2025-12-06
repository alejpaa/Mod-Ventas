package com.venta.backend.cotizacion.infraestructura.email.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Singular;

import java.util.List;

/**
 * Represents an email message with all its components.
 * Uses Builder pattern for clean and flexible construction.
 */
@Getter
@Builder
public class EmailMessage {
    
    private final String fromEmail;
    private final String fromName;
    private final String toEmail;
    private final String subject;
    private final String htmlContent;
    private final String textContent;
    
    @Singular
    private final List<EmailAttachment> attachments;
    
    /**
     * Validates that required fields are present.
     */
    public void validate() {
        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException("From email is required");
        }
        if (toEmail == null || toEmail.isBlank()) {
            throw new IllegalStateException("To email is required");
        }
        if (subject == null || subject.isBlank()) {
            throw new IllegalStateException("Subject is required");
        }
        if (htmlContent == null && textContent == null) {
            throw new IllegalStateException("Either HTML or text content is required");
        }
    }
}
