package com.venta.backend.cliente.infraestructura.clientes.imp;

import com.venta.backend.cliente.infraestructura.clientes.IClienteValidacion;
import org.springframework.stereotype.Component;

/**
 * Implementación SIMULADA del cliente de validación.
 * En producción, esto haría llamadas HTTP reales a un servicio externo
 * que valida restricciones legales/administrativas.
 */
@Component
public class ClienteValidacionImpl implements IClienteValidacion {

    @Override
    public boolean esClienteApto(String dni) {
        // SIMULACIÓN: En producción usarías RestTemplate o WebClient
        // para hacer una llamada HTTP al servicio de validación
        
        // Ejemplo: GET http://validacion-service/api/validar/{dni}
        
        // Si el DNI es null o vacío, no se puede validar, pero se considera apto
        if (dni == null || dni.isBlank()) {
            return true;
        }
        
        // Según los requisitos, el DNI "87654321" tiene restricciones
        if (dni.equals("87654321")) {
            return false;
        }
        
        // Por defecto, todos los demás clientes son aptos
        return true;
    }

    @Override
    public String obtenerMotivoRestriccion(String dni) {
        if (!esClienteApto(dni)) {
            return "Cliente no apto: Presenta restricciones legales o administrativas";
        }
        return null;
    }
}

