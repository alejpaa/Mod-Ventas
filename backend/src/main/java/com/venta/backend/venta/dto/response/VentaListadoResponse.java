package com.venta.backend.venta.dto.response;

import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class VentaListadoResponse {

    Long id;
    String numVenta;
    OrigenVenta origenVenta;
    VentaEstado estado;
    LocalDate fechaVentaCreada;

    // Por ahora no integramos cliente real
    String nombreCliente;
}


