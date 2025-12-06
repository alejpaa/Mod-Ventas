package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
import com.venta.backend.venta.entities.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ReglaTipoCliente implements IReglaDescuento {
    
    // Constantes para las categorías y descuentos
    private static final String TIPO_PLATINO = "PLATINO";
    private static final String TIPO_VIP = "VIP";
    private static final BigDecimal PORCENTAJE_PLATINO = new BigDecimal("0.15"); // 15%
    private static final BigDecimal PORCENTAJE_VIP = new BigDecimal("0.10");    // 10% (Asumido)

    private final IDescuentoStrategy porcentajeStrategy; 
    
    @Autowired
    public ReglaTipoCliente(@Qualifier("porcentajeStrategy") IDescuentoStrategy porcentajeStrategy) {
        this.porcentajeStrategy = porcentajeStrategy;
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        // Esta regla no se aplica si hay un cupón
        if (codigoCupon != null) return false;
        
        String tipoFidelidad = cliente.getTipoFidelidad();
        
        // La regla es aplicable si es PLATINO o VIP
        return tipoFidelidad != null && (TIPO_PLATINO.equals(tipoFidelidad) || TIPO_VIP.equals(tipoFidelidad)); 
    }

    @Override
    public DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente) {
        
        String tipoFidelidad = cliente.getTipoFidelidad();
        BigDecimal porcentajeAplicar;
        String mensaje;

        // Determinar el porcentaje y mensaje basado en el tipo de cliente
        if (TIPO_PLATINO.equals(tipoFidelidad)) {
            porcentajeAplicar = PORCENTAJE_PLATINO;
            mensaje = "15% por fidelidad de cliente PLATINO.";
        } else if (TIPO_VIP.equals(tipoFidelidad)) {
            porcentajeAplicar = PORCENTAJE_VIP;
            mensaje = "10% por fidelidad de cliente VIP.";
        } else {
            // Caso de resguardo, aunque esAplicable() ya filtró esto.
            throw new IllegalStateException("Descuento de cliente aplicado a una categoría no elegible.");
        }

        // Calcular el descuento y el nuevo total de la venta
        BigDecimal montoDescontado = porcentajeStrategy.calcular(venta, porcentajeAplicar);
        
        return new DescuentoAplicadoResponse(
            "CLIENTE_" + tipoFidelidad.toUpperCase(), 
            montoDescontado, 
            // Utilizamos calcularTotal() para obtener el total base, 
            // lo que garantiza la precisión sin importar el estado de venta.getTotal()
            venta.calcularTotal().subtract(montoDescontado), 
            mensaje
        );
    }
    
    @Override public int getPrioridad() { return 50; }
}