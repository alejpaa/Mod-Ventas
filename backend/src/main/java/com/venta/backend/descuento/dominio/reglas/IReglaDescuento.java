package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.venta.entities.Venta;
// Importar entidades de Venta y Cliente...

public interface IReglaDescuento {
    // Evalúa si la regla aplica (ej. el cliente es Platino, el monto es > 500).
    boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon);

    // Aplica el descuento, usando la estrategia de cálculo correspondiente.
    DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente);

    // Prioridad: para elegir el mejor descuento (ej. Cupón 100, Cliente 50, Monto 20).
    int getPrioridad();
}