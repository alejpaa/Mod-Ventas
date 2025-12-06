package com.venta.backend.cotizacion.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CotizacionRequest {

    @NotNull
    private Long clienteId;

    @NotNull
    private Long vendedorId;

    private Integer validezDias;  // Días de validez de la cotización

    @Valid
    @Size(min = 1)
    private List<CotizacionItemRequest> items;
}

