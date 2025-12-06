package com.venta.backend.cotizacion.infraestructura.email.adapter;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.venta.backend.cotizacion.infraestructura.email.model.EmailAttachment;
import com.venta.backend.cotizacion.infraestructura.email.model.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Base64;

/**
 * SendGrid implementation of the email adapter.
 * 
 * Pattern: Adapter
 * Wraps SendGrid API to conform to IEmailAdapter interface.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SendGridEmailAdapter implements IEmailAdapter {
    
    @Value("${sendgrid.api.key:}")
    private String apiKey;
    
    @Override
    public void send(EmailMessage message) {
        message.validate();
        
        if (!isReady()) {
            throw new EmailSendException("SendGrid is not configured. API key is missing.");
        }
        
        try {
            Email from = new Email(message.getFromEmail(), message.getFromName());
            Email to = new Email(message.getToEmail());
            
            // Prefer HTML content, fallback to text
            String contentType = message.getHtmlContent() != null ? "text/html" : "text/plain";
            String contentBody = message.getHtmlContent() != null ? message.getHtmlContent() : message.getTextContent();
            Content content = new Content(contentType, contentBody);
            
            Mail mail = new Mail(from, message.getSubject(), to, content);
            
            // Add attachments if present
            if (message.getAttachments() != null && !message.getAttachments().isEmpty()) {
                for (EmailAttachment attachment : message.getAttachments()) {
                    Attachments sendGridAttachment = new Attachments();
                    String encodedContent = Base64.getEncoder().encodeToString(attachment.getContent());
                    sendGridAttachment.setContent(encodedContent);
                    sendGridAttachment.setType(attachment.getMimeType());
                    sendGridAttachment.setFilename(attachment.getFilename());
                    sendGridAttachment.setDisposition("attachment");
                    mail.addAttachments(sendGridAttachment);
                }
            }
            
            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new EmailSendException("SendGrid returned error: " + response.getBody());
            }
            
            log.info("Email sent successfully to {} via SendGrid", message.getToEmail());
            
        } catch (IOException ex) {
            throw new EmailSendException("Failed to send email via SendGrid", ex);
        }
    }
    
    @Override
    public boolean isReady() {
        return apiKey != null && !apiKey.isBlank();
    }
}
