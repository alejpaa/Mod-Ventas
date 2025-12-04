package com.venta.backend.descuento.dominio.estrategias;

import java.math.BigDecimal;
// Importación de la entidad Venta, basada en la estructura de tu proyecto.
import com.venta.backend.venta.entities.Venta; 


/**
 * Interfaz de Estrategia para el cálculo de descuentos (Strategy Pattern).
 */
public interface IDescuentoStrategy {
    
    /**
     * Calcula el monto a descontar de la Venta.
     * * @param venta La entidad Venta sobre la cual se aplica el descuento.
     * @param valorBase El valor específico de la regla (ej. 0.10 para 10% o 50.00 para S/50 fijo).
     * @return El monto final descontado (en BigDecimal).
     */
    BigDecimal calcular(Venta venta, BigDecimal valorBase); 
}