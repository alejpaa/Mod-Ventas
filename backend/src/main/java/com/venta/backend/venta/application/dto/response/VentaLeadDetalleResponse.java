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
public class VentaLeadDetalleResponse {
    
    // Datos de la venta
    private Long ventaId;
    private String numVenta;
    
    // Datos del cliente
    private Long clienteId;
    private String dni;
    private String nombres;
    private String apellidos;
    private String correo;
    private String telefono;
    
    // Datos de la campaña de marketing
    private Integer idLeadMarketing;
    private String canalOrigen;
    private Integer idCampaniaMarketing;
    private String nombreCampania;
    private String tematica;
    private String descripcion;
    private String notasLlamada;
    private LocalDateTime fechaEnvio;
}
