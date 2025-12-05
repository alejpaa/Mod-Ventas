package com.venta.backend.venta.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaLeadPendienteResponse {
    
    private Long ventaId;
    private String numVenta;
    private String nombreCliente;
    private String nombreCampania;
    private LocalDateTime fechaEnvio;
    private String canalOrigen;
}
