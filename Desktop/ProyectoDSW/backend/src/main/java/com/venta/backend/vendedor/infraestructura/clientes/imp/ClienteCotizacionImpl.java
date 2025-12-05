package com.venta.backend.vendedor.infraestructura.clientes.imp;

import com.venta.backend.vendedor.infraestructura.clientes.IClienteCotizacion;
import org.springframework.stereotype.Component;

/**
 * Implementación SIMULADA del cliente Cotización
 * En producción, verificaría en el módulo de cotizaciones
 */
@Component
public class ClienteCotizacionImpl implements IClienteCotizacion {

    @Override
    public boolean hasPendingQuotations(Long sellerId) {
        // SIMULACIÓN: En producción haría una llamada HTTP
        // GET http://cotizacion-service/api/cotizaciones/pendientes?vendedorId={sellerId}

        // Para testing, simula que algunos vendedores tienen cotizaciones pendientes
        // Por ahora, retornamos false para permitir todas las desactivaciones
        return false;

        // Ejemplo de lógica real:
        // try {
        //     String url = cotizacionServiceUrl + "/api/cotizaciones/pendientes?vendedorId=" + sellerId;
        //     ResponseEntity<Boolean> response = restTemplate.getForEntity(url, Boolean.class);
        //     return response.getBody() != null && response.getBody();
        // } catch (Exception e) {
        //     // Si hay error en la comunicación, asumimos que no hay pendientes
        //     return false;
        // }
    }
}