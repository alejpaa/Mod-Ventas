package com.venta.backend.cotizacion.infraestructura.email.template;

/**
 * Abstract base class for email templates.
 * 
 * Pattern: Template Method
 * Defines the skeleton of email generation with common structure.
 * Subclasses implement specific content while reusing common elements.
 * 
 * Benefits:
 * - Consistent styling across all emails
 * - Reusable header/footer
 * - Easy to add new email types
 * - Centralized style management
 */
public abstract class EmailTemplate {
    
    /**
     * Template method that generates the complete HTML email.
     * This is the algorithm skeleton that cannot be overridden.
     */
    public final String generate() {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>");
        html.append("<html lang='es'>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        html.append("<title>").append(getTitle()).append("</title>");
        html.append("<style>");
        html.append(getStyles());
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        
        // Header (common for all emails)
        html.append(buildHeader());
        
        // Body (specific to each email type)
        html.append(buildBody());
        
        // Footer (common for all emails)
        html.append(buildFooter());
        
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");
        
        return html.toString();
    }
    
    /**
     * Returns the email title (for HTML title tag).
     */
    protected abstract String getTitle();
    
    /**
     * Returns the email subject line.
     */
    public abstract String getSubject();
    
    /**
     * Builds the email body content.
     * This is where subclasses provide their specific content.
     */
    protected abstract String buildBody();
    
    /**
     * Common header for all emails.
     * Can be overridden if needed.
     */
    protected String buildHeader() {
        return 
            "<div class='header'>" +
            "<h1>" + getHeaderTitle() + "</h1>" +
            "</div>";
    }
    
    /**
     * Returns the header title.
     * Subclasses can override to customize.
     */
    protected abstract String getHeaderTitle();
    
    /**
     * Common footer for all emails.
     * Can be overridden if needed.
     */
    protected String buildFooter() {
        return 
            "<div class='footer'>" +
            "<p>Saludos cordiales,<br>Equipo de Ventas</p>" +
            "<p style='font-size: 11px; color: #999; margin-top: 10px;'>" +
            "Este es un correo automático, por favor no responder." +
            "</p>" +
            "</div>";
    }
    
    /**
     * Common CSS styles for all emails.
     * Can be extended by subclasses.
     */
    protected String getStyles() {
        return 
            "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }" +
            ".container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { background-color: #3C83F6; color: white; padding: 30px 20px; text-align: center; }" +
            ".header h1 { margin: 0; font-size: 28px; }" +
            ".content { padding: 30px; }" +
            ".details { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3C83F6; }" +
            ".details p { margin: 10px 0; }" +
            ".button { display: inline-block; padding: 15px 30px; background-color: #3C83F6; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }" +
            ".button:hover { background-color: #2563EB; }" +
            ".footer { text-align: center; padding: 20px; background-color: #f9f9f9; color: #666; font-size: 12px; border-top: 1px solid #eee; }";
    }
}
