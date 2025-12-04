package com.venta.backend.venta.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AgregarItemVentaRequest {

    @NotNull(message = "Debe indicar el ID del producto.")
    private Long itemProductoId;

    @NotNull(message = "Debe indicar la cantidad a agregar.")
    @Min(value = 1, message = "La cantidad mínima es 1.")
    private Integer cantidad;
}

