package com.venta.backend.venta.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AgregarItemVentaRequest {

    @NotNull(message = "Debe indicar el ID del producto.")
    private Long productoId;
    
    @NotBlank(message = "Debe indicar el nombre del producto.")
    private String nombreProducto;
    
    @NotNull(message = "Debe indicar el precio unitario.")
    private BigDecimal precioUnitario;

    @NotNull(message = "Debe indicar la cantidad a agregar.")
    @Min(value = 1, message = "La cantidad mínima es 1.")
    private Integer cantidad;
}

