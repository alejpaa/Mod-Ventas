package com.venta.backend.cliente.infraestructura.clientes;

/**
 * Interfaz para consultar información del módulo de Ventas.
 * Verifica deudas y equipos pendientes de devolución.
 */
public interface IClienteVenta {

    /**
     * Verifica si un cliente tiene deudas pendientes.
     *
     * @param clienteId El ID del cliente.
     * @return true si tiene deudas, false en caso contrario.
     */
    boolean tieneDeudas(Long clienteId);

    /**
     * Verifica si un cliente tiene equipos pendientes de devolución.
     *
     * @param clienteId El ID del cliente.
     * @return true si tiene equipos pendientes, false en caso contrario.
     */
    boolean tieneEquiposPendientes(Long clienteId);

    /**
     * Verifica si un cliente puede ser dado de baja.
     * Un cliente no puede ser dado de baja si tiene deudas o equipos pendientes.
     *
     * @param clienteId El ID del cliente.
     * @return true si puede ser dado de baja, false en caso contrario.
     */
    boolean puedeDarBaja(Long clienteId);
}

