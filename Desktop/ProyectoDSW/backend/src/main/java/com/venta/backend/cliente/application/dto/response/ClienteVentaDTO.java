package com.venta.backend.cliente.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteVentaDTO {

    private Long clienteId;
    private String dni;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String estado;
    private Boolean tieneDeuda; // Flag de deuda
    private Boolean puedeComprar; // Flag operativo
}

