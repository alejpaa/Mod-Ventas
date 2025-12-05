package com.venta.backend.cotizacion.dto;

import com.venta.backend.cotizacion.model.CotizacionEstado;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Value
@Builder
public class CotizacionResponse {
    Integer id;
    String numCotizacion;
    LocalDate fechaCotizacion;
    Double idCliente;
    String sellerCode;
    Integer idSede;
    CotizacionEstado estado;
    Integer validezDias;
    BigDecimal totalCotizado;
    String origenCotizacion;
    List<CotizacionItemResponse> items;
}

