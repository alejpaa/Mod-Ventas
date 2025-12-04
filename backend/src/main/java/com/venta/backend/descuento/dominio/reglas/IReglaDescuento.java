package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
import com.venta.backend.venta.entities.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Regla: Aplica un descuento si el total de la venta supera un monto predefinido.
 */
@Component
public class ReglaMontoMinimo implements IReglaDescuento {
    
    private static final BigDecimal MONTO_REQUERIDO = new BigDecimal("1000.00");
    private static final BigDecimal VALOR_DESCUENTO_FIJO = new BigDecimal("50.00");

    private final IDescuentoStrategy fixedAmountStrategy;

    @Autowired
    public ReglaMontoMinimo(@Qualifier("fixedAmountStrategy") IDescuentoStrategy fixedAmountStrategy) {
        this.fixedAmountStrategy = fixedAmountStrategy;
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        if (codigoCupon != null) return false;
        return venta.calcularTotal().compareTo(MONTO_REQUERIDO) >= 0;
    }
    
    @Override
    public DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente) {
        BigDecimal montoDescontado = fixedAmountStrategy.calcular(venta, VALOR_DESCUENTO_FIJO);
        
        return new DescuentoAplicadoResponse(
            "MONTO_MINIMO", 
            montoDescontado, 
            venta.calcularTotal().subtract(montoDescontado), 
            "S/ 50.00 por exceder el monto mínimo de consumo de S/ 1000.00"
        );
    }
    
    @Override public int getPrioridad() { return 20; } 
}

/**
 * Regla: Aplica un descuento en fechas especiales (ej. Navidad, Día de la Madre).
 */
@Component
public class ReglaFechaEspecial implements IReglaDescuento {
    
    private static final BigDecimal PORCENTAJE_NAVIDAD = new BigDecimal("0.10"); // 10%
    
    // Inyectamos la estrategia de Porcentaje
    private final IDescuentoStrategy porcentajeStrategy;

    @Autowired
    // Usamos @Qualifier para inyectar la implementación PorcentajeStrategy
    public ReglaFechaEspecial(@Qualifier("porcentajeStrategy") IDescuentoStrategy porcentajeStrategy) {
        this.porcentajeStrategy = porcentajeStrategy;
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        if (codigoCupon != null) return false;
        
        LocalDate hoy = LocalDate.now();
        // Simulación: Descuento solo aplica del 20 al 25 de Diciembre
        if (hoy.getMonthValue() == 12 && hoy.getDayOfMonth() >= 20 && hoy.getDayOfMonth() <= 25) {
            return true;
        }
        return false;
    }
    
    @Override
    public DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente) {
        BigDecimal montoDescontado = porcentajeStrategy.calcular(venta, PORCENTAJE_NAVIDAD);
        
        return new DescuentoAplicadoResponse(
            "FECHA_ESPECIAL", 
            montoDescontado, 
            venta.calcularTotal().subtract(montoDescontado), 
            "10% de descuento por la temporada Navideña."
        );
    }
    
    @Override public int getPrioridad() { return 10; } // La más baja
}
