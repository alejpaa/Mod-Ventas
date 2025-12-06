package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
import com.venta.backend.venta.entities.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Regla: Aplica un descuento si el total de la venta supera un monto predefinido.
 */
@Component
public class ReglaMontoMinimo implements IReglaDescuento {

    // Ya no son estáticas ni finales, se inyectarán
    private final BigDecimal montoRequerido;
    private final BigDecimal valorDescuentoFijo;

    private final IDescuentoStrategy fixedAmountStrategy;

    @Autowired
    public ReglaMontoMinimo(
            @Qualifier("fixedAmountStrategy") IDescuentoStrategy fixedAmountStrategy,
            // Inyectar desde propiedades (o un servicio que lea de DB)
            @Value("${descuentos.montoMinimo.requerido:1000.00}") BigDecimal montoRequerido,
            @Value("${descuentos.montoMinimo.descuentoFijo:50.00}") BigDecimal valorDescuentoFijo
    ) {
        this.fixedAmountStrategy = fixedAmountStrategy;
        this.montoRequerido = montoRequerido; // Nuevo: valor inyectado
        this.valorDescuentoFijo = valorDescuentoFijo; // Nuevo: valor inyectado
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        if (codigoCupon != null) return false;
        // Usar el valor inyectado
        return venta.calcularTotal().compareTo(this.montoRequerido) >= 0; 
    }

    @Override
    public DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente) {
        // Usar el valor inyectado
        BigDecimal montoDescontado = fixedAmountStrategy.calcular(venta, this.valorDescuentoFijo);
        
        // Mejorar el mensaje usando los valores
        String mensaje = String.format("S/ %.2f por exceder el monto mínimo de consumo de S/ %.2f", 
                                        this.valorDescuentoFijo, this.montoRequerido);

        return new DescuentoAplicadoResponse(
                "MONTO_MINIMO",
                montoDescontado,
                venta.calcularTotal().subtract(montoDescontado),
                mensaje 
        );
    }

    @Override
    public int getPrioridad() {
        return 20;
    }
}