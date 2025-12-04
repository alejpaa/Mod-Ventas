package com.venta.backend.cliente.application.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrearClienteSimpleRequest {

    private String dni;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
}

