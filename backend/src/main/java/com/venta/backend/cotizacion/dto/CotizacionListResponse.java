package com.venta.backend.cotizacion.dto;

import com.venta.backend.cotizacion.model.CotizacionEstado;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDate;

@Value
@Builder
@AllArgsConstructor
public class CotizacionListResponse {
    Integer id;
    String numCotizacion;
    String clienteNombre;
    LocalDate fechaCotizacion;  // Fecha de creación
    LocalDate fechaExpiracion;   // Fecha de expiración (calculada)
    Integer validezDias;
    BigDecimal totalCotizado;
    CotizacionEstado estado;
}
