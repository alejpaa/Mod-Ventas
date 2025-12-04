package com.venta.backend.vendedor.infraestructura.clientes;

public interface IClienteCotizacion { // ¡Clase en Español!

    /**
     * Verifica en el módulo de Cotizaciones si un vendedor
     * tiene cotizaciones en estado "pendiente" o "en proceso".
     *
     * @param sellerId El ID (Long) del vendedor a verificar.
     * @return true si existen cotizaciones pendientes, false en caso contrario.
     */
    boolean hasPendingQuotations(Long sellerId);
}
