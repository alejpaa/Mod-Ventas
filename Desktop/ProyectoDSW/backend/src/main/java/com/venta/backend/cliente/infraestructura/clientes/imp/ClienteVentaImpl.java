package com.venta.backend.cliente.infraestructura.clientes.imp;

import com.venta.backend.cliente.infraestructura.clientes.IClienteVenta;
import org.springframework.stereotype.Component;

/**
 * Implementación SIMULADA del cliente de Ventas.
 * En producción, esto haría llamadas HTTP reales al módulo de Ventas.
 */
@Component
public class ClienteVentaImpl implements IClienteVenta {

    @Override
    public boolean tieneDeudas(Long clienteId) {
        // SIMULACIÓN: En producción haría una llamada HTTP
        // GET http://venta-service/api/deudas/cliente/{clienteId}
        
        // Por ahora, simula que ningún cliente tiene deudas
        return false;
    }

    @Override
    public boolean tieneEquiposPendientes(Long clienteId) {
        // SIMULACIÓN: En producción haría una llamada HTTP
        // GET http://venta-service/api/equipos/pendientes/cliente/{clienteId}
        
        // Por ahora, simula que ningún cliente tiene equipos pendientes
        return false;
    }

    @Override
    public boolean puedeDarBaja(Long clienteId) {
        // Un cliente puede ser dado de baja solo si no tiene deudas ni equipos pendientes
        return !tieneDeudas(clienteId) && !tieneEquiposPendientes(clienteId);
    }
}

