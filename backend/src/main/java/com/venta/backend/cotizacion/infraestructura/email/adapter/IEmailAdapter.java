package com.venta.backend.cotizacion.infraestructura.email.adapter;

import com.venta.backend.cotizacion.infraestructura.email.model.EmailMessage;

/**
 * Adapter interface for email sending.
 * Allows different email providers to be used interchangeably.
 * 
 * Pattern: Adapter
 * Benefits:
 * - Decouples business logic from email provider
 * - Easy to switch providers (SendGrid, Mailgun, SMTP, etc.)
 * - Testable with mock implementations
 * - Supports fallback mechanisms
 */
public interface IEmailAdapter {
    
    /**
     * Sends an email message.
     * 
     * @param message The email message to send
     * @throws EmailSendException if sending fails
     */
    void send(EmailMessage message);
    
    /**
     * Checks if the adapter is properly configured and ready to send emails.
     * 
     * @return true if ready, false otherwise
     */
    boolean isReady();
}
