package com.venta.backend.vendedor.infraestructura.clientes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmpleadoRRHHDTO {
    private String dni;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;

    private Long employeeId;
}
