package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
// ... otras importaciones
import com.venta.backend.venta.entities.Venta;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ReglaTipoCliente implements IReglaDescuento {
    
    // Inyectar la estrategia que usa esta regla
    private final IDescuentoStrategy porcentajeStrategy; 
    
    // Constructor (Spring inyecta la implementación concreta de PorcentajeStrategy)
    public ReglaTipoCliente(IDescuentoStrategy porcentajeStrategy) {
        this.porcentajeStrategy = porcentajeStrategy;
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        // Lógica: Consultar el tipo de cliente con el DNI
        return "PLATINO".equals(cliente.getTipoFidelidad()); 
    }

    @Override
    public DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente) {
        // Descuento del 15% para clientes Platino
        BigDecimal porcentaje = new BigDecimal("0.15");
        BigDecimal montoDescontado = porcentajeStrategy.calcular(venta, porcentaje);
        
        return new DescuentoAplicadoResponse(
            "CLIENTE_PLATINO", 
            montoDescontado, 
            venta.getTotal().subtract(montoDescontado), 
            "15% por fidelidad de cliente."
        );
    }
    
    @Override public int getPrioridad() { return 50; }
    // Implementar otras reglas (MontoMinimo, FechaEspecial, CupónUnico) de forma similar...
}