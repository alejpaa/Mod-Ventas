package com.venta.backend.cotizacion.infraestructura.email.template;

import com.venta.backend.cotizacion.model.Cotizacion;
import lombok.RequiredArgsConstructor;

/**
 * Email template for sending quotations to clients.
 * 
 * Pattern: Template Method (concrete implementation)
 * Extends EmailTemplate to provide quotation-specific content.
 */
@RequiredArgsConstructor
public class CotizacionEmailTemplate extends EmailTemplate {
    
    private final Cotizacion cotizacion;
    private final String acceptanceLink;
    
    @Override
    protected String getTitle() {
        return "Cotización " + cotizacion.getNumCotizacion();
    }
    
    @Override
    public String getSubject() {
        return "Cotización " + cotizacion.getNumCotizacion();
    }
    
    @Override
    protected String getHeaderTitle() {
        return "Cotización " + cotizacion.getNumCotizacion();
    }
    
    @Override
    protected String buildBody() {
        return String.format(
            "<div class='content'>" +
            "<p>Estimado/a <strong>%s</strong>,</p>" +
            "<p>Adjunto encontrará la cotización solicitada con los siguientes detalles:</p>" +
            "<div class='details'>" +
            "<p><strong>N° Cotización:</strong> %s</p>" +
            "<p><strong>Total:</strong> S/ %.2f</p>" +
            "<p><strong>Validez:</strong> %d días</p>" +
            "</div>" +
            "<p>Para <strong>aceptar esta cotización</strong>, haga clic en el siguiente botón:</p>" +
            "<div style='text-align: center;'>" +
            "<a href='%s' class='button' style='color: #ffffff;'>✓ Aceptar Cotización</a>" +
            "</div>" +
            "<p style='margin-top: 30px;'>Si tiene alguna pregunta, no dude en contactarnos.</p>" +
            "<p>Gracias por su preferencia.</p>" +
            "</div>",
            cotizacion.getCliente().getFullName(),
            cotizacion.getNumCotizacion(),
            cotizacion.getTotalCotizado(),
            cotizacion.getValidezDias(),
            acceptanceLink
        );
    }
}
