package com.venta.backend.descuento.dominio.estrategias;

import java.math.BigDecimal;
import java.math.RoundingMode;
import com.venta.backend.venta.entities.Venta;
import org.springframework.stereotype.Component;

/**
 * Implementación de la Estrategia de Descuento por Porcentaje.
 * Calcula el descuento aplicando un porcentaje sobre el total de la venta.
 */
@Component
public class PorcentajeStrategy implements IDescuentoStrategy {
    
    /**
     * Calcula el monto a descontar aplicando un porcentaje sobre el total de la venta.
     * 
     * @param venta La entidad Venta sobre la cual se aplica el descuento.
     * @param valorBase El porcentaje a aplicar (ej. 0.10 para 10%, 0.15 para 15%).
     * @return El monto final descontado (en BigDecimal).
     */
    @Override
    public BigDecimal calcular(Venta venta, BigDecimal valorBase) {
        if (venta == null || venta.getTotal() == null) {
            return BigDecimal.ZERO;
        }
        
        if (valorBase == null || valorBase.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        // Calcula el descuento: total * porcentaje
        BigDecimal montoDescuento = venta.getTotal()
            .multiply(valorBase)
            .setScale(2, RoundingMode.HALF_UP);
        
        return montoDescuento;
    }
}