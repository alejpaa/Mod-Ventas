package com.venta.backend.cotizacion.infraestructura.email.template;

import com.venta.backend.cotizacion.model.Cotizacion;

/**
 * Factory for creating email templates.
 * 
 * Pattern: Factory
 * Centralizes template creation logic.
 * 
 * Benefits:
 * - Single point of template creation
 * - Easy to add new template types
 * - Encapsulates creation logic
 */
public class EmailTemplateFactory {
    
    public enum TemplateType {
        QUOTATION,
        ACCEPTANCE_CONFIRMATION,
        REMINDER
    }
    
    /**
     * Creates an email template based on type.
     */
    public static EmailTemplate create(TemplateType type, Cotizacion cotizacion, String... params) {
        return switch (type) {
            case QUOTATION -> {
                String acceptanceLink = params.length > 0 ? params[0] : "";
                yield new CotizacionEmailTemplate(cotizacion, acceptanceLink);
            }
            case ACCEPTANCE_CONFIRMATION -> throw new UnsupportedOperationException("Not implemented yet");
            case REMINDER -> throw new UnsupportedOperationException("Not implemented yet");
        };
    }
}
