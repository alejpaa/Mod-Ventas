package com.venta.backend.cliente.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class RegistroClienteRequest {

    @NotNull(message = "DNI es obligatorio")
    @NotBlank(message = "DNI no puede estar vacío")
    @Pattern(regexp = "\\d{8}", message = "DNI debe tener exactamente 8 dígitos")
    private String dni;
    
    @NotNull(message = "Nombre es obligatorio")
    @NotBlank(message = "Nombre no puede estar vacío")
    private String firstName;
    
    @NotNull(message = "Apellido es obligatorio")
    @NotBlank(message = "Apellido no puede estar vacío")
    private String lastName;
    
    @Email(message = "Email debe ser válido")
    private String email;
    
    @NotNull(message = "Teléfono es obligatorio")
    @NotBlank(message = "Teléfono no puede estar vacío")
    private String phoneNumber;
    
    private String telefonoFijo;
    private String address;
    private LocalDate fechaNacimiento;
    private String genero;
    private String ocupacion;
}

