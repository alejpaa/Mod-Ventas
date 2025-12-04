package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.venta.entities.Venta;

/**
 * Interfaz que define el contrato para las reglas de descuento.
 * Cada regla debe implementar esta interfaz para determinar si es aplicable
 * y cómo aplicar el descuento correspondiente.
 */
public interface IReglaDescuento {

    /**
     * Determina si esta regla de descuento es aplicable para la venta actual.
     *
     * @param venta La venta a evaluar
     * @param cliente El cliente que realiza la compra
     * @param codigoCupon Código de cupón si existe (puede ser null)
     * @return true si la regla es aplicable, false en caso contrario
     */
    boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon);

    /**
     * Aplica el descuento según esta regla y retorna la información del descuento.
     *
     * @param venta La venta a la cual aplicar el descuento
     * @param cliente El cliente que realiza la compra
     * @return Objeto con los detalles del descuento aplicado
     */
    DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente);

    /**
     * Obtiene la prioridad de esta regla.
     * Las reglas con menor número tienen mayor prioridad y se evalúan primero.
     *
     * @return Número de prioridad (menor = mayor prioridad)
     */
    int getPrioridad();
}