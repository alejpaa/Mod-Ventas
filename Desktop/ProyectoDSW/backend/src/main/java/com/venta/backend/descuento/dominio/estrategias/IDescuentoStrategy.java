package com.venta.backend.descuento.dominio.estrategias;

import java.math.BigDecimal;
// IMPORTACIONES NECESARIAS: Ajustar las rutas si las entidades están en otro paquete
import com.venta.backend.venta.entities.Venta;
// Asumimos que existe una entidad Cliente o una representación similar
// import com.venta.backend.cliente.entities.Cliente; 
// La entidad Cliente no está explícita en tu módulo de Venta, pero es necesaria para el cálculo.


/**
 * Interfaz que define la Estrategia de Cálculo del Descuento (Strategy Pattern).
 * Cada implementación concreta (ej. PorcentajeStrategy) definirá un método de cálculo distinto.
 */
public interface IDescuentoStrategy {
    
    /**
     * Calcula el monto final a descontar.
     * * @param venta La entidad Venta sobre la cual se calcula el descuento.
     * @param valorBase El valor específico de la regla (ej. 0.15 para 15% o 50.00 para S/50 fijo).
     * @return El monto final descontado (en BigDecimal).
     */
    BigDecimal calcular(Venta venta, BigDecimal valorBase); 
}