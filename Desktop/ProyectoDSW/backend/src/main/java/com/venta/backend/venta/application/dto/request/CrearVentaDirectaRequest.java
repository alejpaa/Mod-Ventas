package com.venta.backend.venta.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CrearVentaDirectaRequest {

    @NotBlank(message = "Debe registrar el usuario que crea la venta.")
    private String usuarioCreador;
}

