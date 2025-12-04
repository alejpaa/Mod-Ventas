package com.venta.backend.cliente.application.dto.request;

import com.venta.backend.cliente.enums.EstadoClienteEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModificacionClienteRequest {

    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    
    // Estado del cliente (para activar, desactivar o bloquear)
    private EstadoClienteEnum estado;
}

