package com.venta.backend.cliente.application.dto.request;

import com.venta.backend.cliente.enums.EstadoClienteEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModificacionClienteRequest {

    private String dni;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String telefonoFijo;
    private String address;
    private LocalDate fechaNacimiento;
    
    // Estado del cliente (para activar, desactivar o bloquear)
    private EstadoClienteEnum estado;
}

