package com.venta.backend.descuento.aplicacion;

import com.venta.backend.descuento.dominio.reglas.IReglaDescuento;
import com.venta.backend.descuento.DTO.AplicarDescuentoRequest;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import org.springframework.stereotype.Service;
// Importaciones de VentaRepository, ClienteService, etc.

@Service
public class DiscountService {
    
    private final List<IReglaDescuento> todasLasReglas;
    // Repositorios y Servicios inyectados...

    public DiscountService(List<IReglaDescuento> todasLasReglas) {
        // Spring inyecta TODAS las implementaciones de IReglaDescuento.
        this.todasLasReglas = todasLasReglas; 
    }

    public DescuentoAplicadoResponse aplicarMejorDescuento(AplicarDescuentoRequest request) {
        // 1. Obtener Entidades (usando el DNI del request)
        Venta venta = ventaRepository.findById(request.getVentaId()); 
        Cliente cliente = clienteService.findByDni(request.getDniCliente()); 
        
        DescuentoAplicadoResponse mejorDescuento = null;

        // 2. Evaluar todas las reglas (incluyendo el cupón)
        for (IReglaDescuento regla : todasLasReglas) {
            if (regla.esAplicable(venta, cliente, request.getCodigoCupon())) {
                DescuentoAplicadoResponse descuentoActual = regla.aplicar(venta, cliente);
                
                // Lógica de Priorización: Se elige el de mayor monto o mayor prioridad.
                if (mejorDescuento == null || descuentoActual.getMontoDescontado().compareTo(mejorDescuento.getMontoDescontado()) > 0) {
                    mejorDescuento = descuentoActual;
                }
            }
        }
        
        if (mejorDescuento != null) {
            // Actualizar la Venta en la base de datos (persistencia del descuento)
            venta.aplicarDescuento(mejorDescuento); 
            ventaRepository.save(venta);
            return mejorDescuento;
        }
        
        // No se aplicó ningún descuento
        return new DescuentoAplicadoResponse("NINGUNO", BigDecimal.ZERO, venta.getTotal(), "No aplicó ningún descuento.");
    }
}