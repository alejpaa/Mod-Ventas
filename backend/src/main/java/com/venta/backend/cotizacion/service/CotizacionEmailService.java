package com.venta.backend.cotizacion.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.venta.backend.cotizacion.model.Cotizacion;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class CotizacionEmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;
    
    @Value("${sendgrid.from.email:janomanu23@gmail.com}")
    private String fromEmail;
    
    @Value("${sendgrid.from.name:Empresa de Telecomunicaciones}")
    private String fromName;

    public void enviarCotizacion(Cotizacion cotizacion, String destinatario, String enlaceAceptacion) {
        // TODO: Implementar envío de correo sin PDF (legacy)
    }
    
    public void enviarCotizacionConPdf(Cotizacion cotizacion, String destinatario, String enlaceAceptacion, byte[] pdfBytes) {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(destinatario);
        String subject = "Cotización " + cotizacion.getNumCotizacion();
        
        // HTML Email body with styled button
        String htmlBody = String.format(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
            ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
            ".header { background-color: #3C83F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }" +
            ".content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }" +
            ".details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3C83F6; }" +
            ".button { display: inline-block; padding: 15px 30px; background-color: #3C83F6; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }" +
            ".button:hover { background-color: #2563EB; }" +
            ".footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class='container'>" +
            "<div class='header'>" +
            "<h1>Cotización %s</h1>" +
            "</div>" +
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
            "</div>" +
            "<div class='footer'>" +
            "<p>Saludos cordiales,<br>Equipo de Ventas</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
            cotizacion.getNumCotizacion(),
            cotizacion.getCliente().getFullName(),
            cotizacion.getNumCotizacion(),
            cotizacion.getTotalCotizado(),
            cotizacion.getValidezDias(),
            enlaceAceptacion
        );
        
        Content content = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, subject, to, content);
        
        // Attach PDF
        if (pdfBytes != null && pdfBytes.length > 0) {
            Attachments attachments = new Attachments();
            String encodedPdf = Base64.getEncoder().encodeToString(pdfBytes);
            attachments.setContent(encodedPdf);
            attachments.setType("application/pdf");
            attachments.setFilename("Cotizacion_" + cotizacion.getNumCotizacion() + ".pdf");
            attachments.setDisposition("attachment");
            mail.addAttachments(attachments);
        }
        
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("Error al enviar email: " + response.getBody());
            }
        } catch (IOException ex) {
            throw new RuntimeException("Error al enviar email con PDF: " + ex.getMessage(), ex);
        }
    }
}
