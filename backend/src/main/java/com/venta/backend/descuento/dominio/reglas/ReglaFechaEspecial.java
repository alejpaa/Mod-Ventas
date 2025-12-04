package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
import com.venta.backend.venta.entities.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Regla: Aplica un descuento en fechas especiales (ej. Navidad, Día de la Madre).
 */
@Component
public class ReglaFechaEspecial implements IReglaDescuento {

    private static final BigDecimal PORCENTAJE_NAVIDAD = new BigDecimal("0.10"); // 10%

    private final IDescuentoStrategy porcentajeStrategy;

    @Autowired
    public ReglaFechaEspecial(@Qualifier("porcentajeStrategy") IDescuentoStrategy porcentajeStrategy) {
        this.porcentajeStrategy = porcentajeStrategy;
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        if (codigoCupon != null) return false;

        LocalDate hoy = LocalDate.now();

        // Descuento solo aplica del 20 al 25 de Diciembre
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

    @Override
    public int getPrioridad() {
        return 10;
    }
}