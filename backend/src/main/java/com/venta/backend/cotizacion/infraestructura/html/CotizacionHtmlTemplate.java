package com.venta.backend.cotizacion.infraestructura.html;

import com.venta.backend.cotizacion.model.Cotizacion;
import org.springframework.stereotype.Component;

/**
 * Generates HTML pages for quotation acceptance flow.
 */
@Component
public class CotizacionHtmlTemplate {

    public String generateAutoAcceptPage(Cotizacion cotizacion) {
        return String.format(
            "<!DOCTYPE html>" +
            "<html lang='es'>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "<title>Aceptando Cotización</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }" +
            ".container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%%; text-align: center; }" +
            ".spinner { width: 60px; height: 60px; margin: 20px auto; border: 6px solid #f3f3f3; border-top: 6px solid #3C83F6; border-radius: 50%%; animation: spin 1s linear infinite; }" +
            "@keyframes spin { 0%% { transform: rotate(0deg); } 100%% { transform: rotate(360deg); } }" +
            "h1 { color: #333; margin: 20px 0 10px 0; }" +
            ".quotation-number { color: #3C83F6; font-size: 20px; font-weight: bold; margin-bottom: 20px; }" +
            ".message { color: #666; margin: 20px 0; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class='container'>" +
            "<div class='spinner'></div>" +
            "<h1>Procesando...</h1>" +
            "<div class='quotation-number'>%s</div>" +
            "<p class='message'>Estamos aceptando su cotización.<br>Por favor espere un momento...</p>" +
            "</div>" +
            "<script>" +
            "setTimeout(function() {" +
            "  window.location.href = '/api/cotizaciones/%d/aceptacion/exito';" +
            "}, 2000);" +
            "</script>" +
            "</body>" +
            "</html>",
            cotizacion.getNumCotizacion(),
            cotizacion.getId()
        );
    }

    public String generateSuccessPage(Cotizacion cotizacion) {
        return String.format(
            "<!DOCTYPE html>" +
            "<html lang='es'>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "<title>Cotización Aceptada</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }" +
            ".container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%%; text-align: center; }" +
            ".icon { font-size: 80px; margin-bottom: 20px; animation: bounce 1s; }" +
            "@keyframes bounce { 0%%, 20%%, 50%%, 80%%, 100%% { transform: translateY(0); } 40%% { transform: translateY(-20px); } 60%% { transform: translateY(-10px); } }" +
            "h1 { color: #10b981; margin-bottom: 10px; }" +
            ".quotation-number { color: #3C83F6; font-size: 20px; font-weight: bold; margin-bottom: 20px; }" +
            ".message { color: #666; line-height: 1.6; margin: 20px 0; }" +
            ".details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }" +
            ".details p { margin: 10px 0; color: #666; }" +
            ".details strong { color: #333; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class='container'>" +
            "<div class='icon'>✅</div>" +
            "<h1>¡Cotización Aceptada!</h1>" +
            "<div class='quotation-number'>%s</div>" +
            "<p class='message'>Su cotización ha sido aceptada exitosamente. Nuestro equipo de ventas se pondrá en contacto con usted a la brevedad para coordinar los siguientes pasos.</p>" +
            "<div class='details'>" +
            "<p><strong>Cliente:</strong> %s</p>" +
            "<p><strong>Total:</strong> S/ %.2f</p>" +
            "<p><strong>Estado:</strong> <span style='color: #10b981; font-weight: bold;'>ACEPTADA</span></p>" +
            "</div>" +
            "<p style='color: #999; font-size: 14px; margin-top: 30px;'>Gracias por su preferencia</p>" +
            "</div>" +
            "</body>" +
            "</html>",
            cotizacion.getNumCotizacion(),
            cotizacion.getCliente().getFullName(),
            cotizacion.getTotalCotizado()
        );
    }
}
