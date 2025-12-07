package com.venta.backend.cliente.application.dto.request;

import com.venta.backend.cliente.enums.EstadoClienteEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
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

    @Pattern(regexp = "\\d{8}", message = "DNI debe tener exactamente 8 dígitos")
    private String dni;
    
    private String firstName;
    private String lastName;
    
    @Email(message = "Email debe ser válido")
    private String email;
    
    private String phoneNumber;
    private String telefonoFijo;
    private String address;
    private LocalDate fechaNacimiento;
    private String genero;
    private String ocupacion;

    // Estado del cliente (para activar, desactivar o bloquear)
    private EstadoClienteEnum estado;
}

