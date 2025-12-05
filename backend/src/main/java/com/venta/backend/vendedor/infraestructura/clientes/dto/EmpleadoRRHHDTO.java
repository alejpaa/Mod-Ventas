package com.venta.backend.vendedor.infraestructura.clientes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmpleadoRRHHDTO {
    private Long idEmpleado;

    // Mapeo directo a los nombres del JSON de RRHH
    private String documentoIdentidad;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno; // Lo usaremos para el fullName
    private String direccion;
    private String telefono;
    private String email;
}
