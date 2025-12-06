package com.venta.backend.cotizacion.infraestructura.pdf;

import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.DetalleCotizacion;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/**
 * Generates HTML templates for quotation PDFs.
 */
@Component
public class CotizacionPdfTemplate {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public String generateHtml(Cotizacion cotizacion) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'/>");
        html.append("<style>");
        html.append(getStyles());
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        
        // Header
        html.append("<div class='header'>");
        html.append("<h1>COTIZACIÓN</h1>");
        html.append("<div class='company-info'>");
        html.append("<p><strong>Empresa de Ventas</strong></p>");
        html.append("<p>RUC: 20123456789</p>");
        html.append("<p>Dirección: Av. Principal 123, Lima</p>");
        html.append("<p>Teléfono: (01) 234-5678</p>");
        html.append("</div>");
        html.append("</div>");
        
        // Quotation info
        html.append("<div class='quotation-info'>");
        html.append("<table class='info-table'>");
        html.append("<tr><td><strong>N° Cotización:</strong></td><td>").append(cotizacion.getNumCotizacion()).append("</td></tr>");
        html.append("<tr><td><strong>Fecha de Creación:</strong></td><td>").append(cotizacion.getFechaCotizacion().format(DATE_FORMATTER)).append("</td></tr>");
        
        // Add expiration date if available
        if (cotizacion.getFechaExpiracion() != null) {
            html.append("<tr><td><strong>Fecha de Expiración:</strong></td><td>").append(cotizacion.getFechaExpiracion().format(DATE_FORMATTER)).append("</td></tr>");
        }
        
        html.append("<tr><td><strong>Cliente:</strong></td><td>").append(cotizacion.getCliente().getFullName()).append("</td></tr>");
        html.append("<tr><td><strong>Vendedor:</strong></td><td>").append(cotizacion.getVendedor().getFullName()).append("</td></tr>");
        html.append("<tr><td><strong>Validez:</strong></td><td>").append(cotizacion.getValidezDias()).append(" días</td></tr>");
        html.append("</table>");
        html.append("</div>");
        
        // Items table
        html.append("<div class='items-section'>");
        html.append("<h2>Detalle de Productos/Servicios</h2>");
        html.append("<table class='items-table'>");
        html.append("<thead>");
        html.append("<tr>");
        html.append("<th>Producto</th>");
        html.append("<th>Cantidad</th>");
        html.append("<th>Precio Unit.</th>");
        html.append("<th>Subtotal</th>");
        html.append("</tr>");
        html.append("</thead>");
        html.append("<tbody>");
        
        for (DetalleCotizacion item : cotizacion.getItems()) {
            html.append("<tr>");
            html.append("<td>").append(item.getProducto().getNombre()).append("</td>");
            html.append("<td>").append(item.getCantidad()).append("</td>");
            html.append("<td>S/ ").append(formatMoney(item.getPrecioUnitario())).append("</td>");
            html.append("<td>S/ ").append(formatMoney(item.getSubtotal())).append("</td>");
            html.append("</tr>");
        }
        
        html.append("</tbody>");
        html.append("</table>");
        html.append("</div>");
        
        // Totals
        html.append("<div class='totals-section'>");
        html.append("<table class='totals-table'>");
        html.append("<tr><td><strong>TOTAL:</strong></td><td><strong>S/ ").append(formatMoney(cotizacion.getTotalCotizado())).append("</strong></td></tr>");
        html.append("</table>");
        html.append("</div>");
        
        // Footer
        html.append("<div class='footer'>");
        html.append("<p>Esta cotización tiene una validez de ").append(cotizacion.getValidezDias()).append(" días a partir de la fecha de emisión.</p>");
        html.append("<p>Gracias por su preferencia.</p>");
        html.append("</div>");
        
        html.append("</body>");
        html.append("</html>");
        
        return html.toString();
    }

    private String getStyles() {
        return """
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #3C83F6;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #3C83F6;
                margin: 0;
                font-size: 32px;
            }
            .company-info {
                margin-top: 10px;
                font-size: 12px;
            }
            .company-info p {
                margin: 3px 0;
            }
            .quotation-info {
                margin: 30px 0;
            }
            .info-table {
                width: 100%;
                border-collapse: collapse;
            }
            .info-table td {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
            .info-table td:first-child {
                width: 150px;
            }
            .items-section {
                margin: 30px 0;
            }
            .items-section h2 {
                color: #3C83F6;
                font-size: 18px;
                margin-bottom: 15px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .items-table th {
                background-color: #3C83F6;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: bold;
            }
            .items-table td {
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }
            .items-table tbody tr:hover {
                background-color: #f5f5f5;
            }
            .totals-section {
                margin: 30px 0;
                text-align: right;
            }
            .totals-table {
                margin-left: auto;
                border-top: 2px solid #3C83F6;
                padding-top: 10px;
            }
            .totals-table td {
                padding: 8px 15px;
                font-size: 18px;
            }
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            .footer p {
                margin: 5px 0;
            }
            """;
    }

    private String formatMoney(BigDecimal amount) {
        return String.format("%.2f", amount);
    }
}
