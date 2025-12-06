package com.venta.backend.cotizacion.service;

import com.venta.backend.cotizacion.infraestructura.email.adapter.IEmailAdapter;
import com.venta.backend.cotizacion.infraestructura.email.model.EmailAttachment;
import com.venta.backend.cotizacion.infraestructura.email.model.EmailMessage;
import com.venta.backend.cotizacion.infraestructura.email.template.EmailTemplate;
import com.venta.backend.cotizacion.infraestructura.email.template.EmailTemplateFactory;
import com.venta.backend.cotizacion.infraestructura.email.template.EmailTemplateFactory.TemplateType;
import com.venta.backend.cotizacion.model.Cotizacion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service for sending quotation emails.
 * 
 * Refactored to use Design Patterns:
 * - Adapter Pattern: IEmailAdapter for provider abstraction
 * - Builder Pattern: EmailMessage for clean construction
 * - Template Method: EmailTemplate for reusable templates
 * - Factory Pattern: EmailTemplateFactory for template creation
 * 
 * Benefits:
 * - Decoupled from SendGrid (can switch providers easily)
 * - Clean and readable code
 * - Reusable email templates
 * - Easy to test with mocks
 * - Extensible for new email types
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CotizacionEmailService {
    
    private final IEmailAdapter emailAdapter;
    
    @Value("${sendgrid.from.email:janomanu23@gmail.com}")
    private String fromEmail;
    
    @Value("${sendgrid.from.name:Empresa de Telecomunicaciones}")
    private String fromName;
    
    /**
     * Sends quotation email with PDF attachment.
     * 
     * @param cotizacion The quotation to send
     * @param destinatario Recipient email address
     * @param enlaceAceptacion Acceptance link URL
     * @param pdfBytes PDF file as byte array
     */
    public void enviarCotizacionConPdf(
            Cotizacion cotizacion, 
            String destinatario, 
            String enlaceAceptacion, 
            byte[] pdfBytes) {
        
        log.info("Sending quotation {} to {}", cotizacion.getNumCotizacion(), destinatario);
        
        // Create email template using Factory pattern
        EmailTemplate template = EmailTemplateFactory.create(
            TemplateType.QUOTATION, 
            cotizacion, 
            enlaceAceptacion
        );
        
        // Build email message using Builder pattern
        EmailMessage.EmailMessageBuilder messageBuilder = EmailMessage.builder()
            .fromEmail(fromEmail)
            .fromName(fromName)
            .toEmail(destinatario)
            .subject(template.getSubject())
            .htmlContent(template.generate());
        
        // Add PDF attachment if present
        if (pdfBytes != null && pdfBytes.length > 0) {
            EmailAttachment pdfAttachment = EmailAttachment.pdf(
                pdfBytes, 
                "Cotizacion_" + cotizacion.getNumCotizacion() + ".pdf"
            );
            messageBuilder.attachment(pdfAttachment);
        }
        
        EmailMessage message = messageBuilder.build();
        
        // Send email using Adapter pattern
        emailAdapter.send(message);
        
        log.info("Quotation email sent successfully to {}", destinatario);
    }
    
    /**
     * Legacy method - kept for backward compatibility.
     * TODO: Remove once all callers are updated.
     */
    @Deprecated
    public void enviarCotizacion(Cotizacion cotizacion, String destinatario, String enlaceAceptacion) {
        log.warn("Using deprecated enviarCotizacion method without PDF");
        enviarCotizacionConPdf(cotizacion, destinatario, enlaceAceptacion, null);
    }
}
