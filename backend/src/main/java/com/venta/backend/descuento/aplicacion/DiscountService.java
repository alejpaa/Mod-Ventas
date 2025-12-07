package com.venta.backend.descuento.aplicacion;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import com.venta.backend.descuento.dominio.reglas.IReglaDescuento;
import com.venta.backend.descuento.DTO.AplicarDescuentoRequest;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.venta.backend.descuento.aplicacion.exceptions.CuponNoValidoException;
import com.venta.backend.descuento.dominio.entidades.Cupon;
import com.venta.backend.descuento.infraestructura.repository.CuponRepositorio;
import java.util.Optional;
import java.math.BigDecimal;
import java.util.List;

// NUEVOS IMPORTS para el Log
import com.venta.backend.descuento.dominio.entidades.LogDescuentoAplicado;
import com.venta.backend.descuento.infraestructura.repository.LogDescuentoAplicadoRepositorio; 

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
    private final CuponRepositorio cuponRepositorio;
    private final LogDescuentoAplicadoRepositorio logDescuentoAplicadoRepositorio; // REPOSITORIO INYECTADO

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

        // 2. Lógica de validación explícita del cupón (Si se proporciona)
        if (request.getCodigoCupon() != null && !request.getCodigoCupon().trim().isEmpty()) {
            String codigoCupon = request.getCodigoCupon().trim();
            Optional<Cupon> cuponOpt = cuponRepositorio.findByCodigo(codigoCupon);
            BigDecimal totalVenta = venta.calcularTotal();

            if (cuponOpt.isEmpty()) {
                // **Motivo: No existe**
                throw new CuponNoValidoException("El cupón '" + codigoCupon + "' no existe.");
            }

            Cupon cupon = cuponOpt.get();

            if (cupon.estaExpirado()) {
                // **Motivo: Vencido**
                throw new CuponNoValidoException("El cupón '" + codigoCupon + "' está expirado (Fecha: " + cupon.getFechaExpiracion() + ").");
            }

            if (!cupon.tieneUsosDisponibles()) {
                // **Motivo: Usos agotados**
                throw new CuponNoValidoException("El cupón '" + codigoCupon + "' ya fue utilizado la cantidad máxima de veces.");
            }
        }

        // 3. Evaluar todas las reglas (incluyendo el cupón)
        for (IReglaDescuento regla : todasLasReglas) {
            if (regla.esAplicable(venta, cliente, request.getCodigoCupon())) {
                DescuentoAplicadoResponse descuentoActual = regla.aplicar(venta, cliente);

                // Lógica de Priorización: Se elige el de mayor monto
                if (mejorDescuento == null || descuentoActual.getMontoDescontado().compareTo(mejorDescuento.getMontoDescontado()) > 0) {
                    mejorDescuento = descuentoActual;
                }
            }
        }

        // 4. Lógica de Persistencia y Log
        DescuentoAplicadoResponse descuentoFinal = mejorDescuento;

        if (descuentoFinal == null) {
            // Caso 4a: No se aplicó ningún descuento
            descuentoFinal = new DescuentoAplicadoResponse("NINGUNO", BigDecimal.ZERO, venta.getTotal(), "No aplicó ningún descuento.");
        }
        
        // Código de cupón para el log (si se proporcionó en la solicitud)
        String codigoCuponParaLog = request.getCodigoCupon(); 

        // 4.1. Actualizar la Venta (Montos)
        venta.setDescuentoTotal(descuentoFinal.getMontoDescontado());
        venta.setTotal(descuentoFinal.getNuevoTotalVenta());
        
        // 4.2. Crear el objeto Log
        LogDescuentoAplicado logAplicado = LogDescuentoAplicado.fromResponse(
                venta,
                descuentoFinal.getTipoDescuento(),
                descuentoFinal.getMontoDescontado(),
                descuentoFinal.getDescripcion(),
                codigoCuponParaLog
        );
        
        // 4.3. Establecer y guardar la Venta (el Log se guarda en cascada)
        venta.setDescuentoAplicado(logAplicado); // Establecer relación bidireccional

        ventaRepositorio.save(venta); // Guarda Venta y Log (por CascadeType.ALL)
        
        // 4.4. Actualizar el contador de usos del cupón (solo si fue la regla ganadora)
        // Se asume que la regla de cupón devuelve el TipoDescuento "CUPON"
        if ("CUPON".equals(descuentoFinal.getTipoDescuento()) && codigoCuponParaLog != null) {
             cuponRepositorio.findByCodigo(codigoCuponParaLog)
                 .ifPresent(cupon -> {
                     cupon.usar(); // Asumiendo que Cupon.java tiene el método usar()
                     cuponRepositorio.save(cupon);
                 });
        }

        return descuentoFinal; // Retornar el resultado final de la aplicación del descuento
    }
}