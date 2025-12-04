package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
import com.venta.backend.venta.entities.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

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

    @Override
    public int getPrioridad() {
        return 20;
    }
}