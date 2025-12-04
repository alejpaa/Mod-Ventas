package com.venta.backend.descuento.aplicacion;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import com.venta.backend.descuento.dominio.reglas.IReglaDescuento;
import com.venta.backend.descuento.DTO.AplicarDescuentoRequest;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.infraestructura.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Servicio de aplicación de descuentos.
 * Evalúa todas las reglas de descuento disponibles y aplica la mejor opción.
 */
@Service
@RequiredArgsConstructor
public class DiscountService {

    private final List<IReglaDescuento> todasLasReglas;
    private final VentaRepositorio ventaRepositorio;
    private final ClienteRepositorio clienteRepositorio;

    /**
     * Aplica el mejor descuento disponible para una venta.
     * Evalúa todas las reglas registradas y selecciona la que ofrece mayor beneficio.
     *
     * @param request Datos necesarios para evaluar descuentos (ventaId, dniCliente, codigoCupon)
     * @return Respuesta con el descuento aplicado o indicación de que no se aplicó ninguno
     */
    public DescuentoAplicadoResponse aplicarMejorDescuento(AplicarDescuentoRequest request) {
        // 1. Obtener Entidades
        Venta venta = ventaRepositorio.findById(Long.parseLong(request.getVentaId()))
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + request.getVentaId()));

        Cliente cliente = clienteRepositorio.findByDni(request.getDniCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con DNI: " + request.getDniCliente()));

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
            venta.setDescuentoTotal(mejorDescuento.getMontoDescontado());
            venta.setTotal(mejorDescuento.getNuevoTotalVenta());
            ventaRepositorio.save(venta);
            return mejorDescuento;
        }

        // No se aplicó ningún descuento
        return new DescuentoAplicadoResponse("NINGUNO", BigDecimal.ZERO, venta.getTotal(), "No aplicó ningún descuento.");
    }
}