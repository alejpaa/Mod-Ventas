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
        
        // Email body
        String bodyText = String.format(
            "Estimado/a %s,\n\n" +
            "Adjunto encontrará la cotización N° %s.\n\n" +
            "Detalles:\n" +
            "- Total: S/ %.2f\n" +
            "- Validez: %d días\n\n" +
            "Para aceptar esta cotización, puede hacer clic en el siguiente enlace:\n" +
            "%s\n\n" +
            "Gracias por su preferencia.\n\n" +
            "Saludos cordiales,\n" +
            "Equipo de Ventas",
            cotizacion.getCliente().getFullName(),
            cotizacion.getNumCotizacion(),
            cotizacion.getTotalCotizado(),
            cotizacion.getValidezDias(),
            enlaceAceptacion
        );
        
        Content content = new Content("text/plain", bodyText);
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
