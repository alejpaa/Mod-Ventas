package com.venta.backend.cliente.infraestructura.clientes;

/**
 * Interfaz para validar elegibilidad de clientes.
 * Valida DNI y restricciones legales/administrativas.
 */
public interface IClienteValidacion {

    /**
     * Valida si un cliente es apto para registrarse en el sistema.
     * Verifica restricciones legales o administrativas.
     *
     * @param dni El DNI del cliente a validar.
     * @return true si el cliente es apto, false si tiene restricciones.
     */
    boolean esClienteApto(String dni);

    /**
     * Obtiene el motivo de restricción si el cliente no es apto.
     *
     * @param dni El DNI del cliente.
     * @return Mensaje con el motivo de restricción, o null si es apto.
     */
    String obtenerMotivoRestriccion(String dni);
}

