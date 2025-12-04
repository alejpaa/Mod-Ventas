package com.venta.backend.descuento.dominio.estrategias;

import com.venta.backend.venta.entities.Venta;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;


@Component
public class FixedAmountStrategy implements IDescuentoStrategy {
    
    @Override
    public BigDecimal calcular(Venta venta, BigDecimal montoFijo) {
        return venta.calcularTotal().min(montoFijo); 
    }
}