package com.venta.backend.descuento.dominio.estrategias;

import java.math.BigDecimal;
import com.venta.backend.venta.entities.Venta;

public interface IDescuentoStrategy {
    
    /**
     * Calcula el monto final a descontar.
     * * @param venta La entidad Venta sobre la cual se calcula el descuento.
     * @param valorBase El valor específico de la regla 
     * @return El monto final descontado (en BigDecimal).
     */
    BigDecimal calcular(Venta venta, BigDecimal valorBase); 
}