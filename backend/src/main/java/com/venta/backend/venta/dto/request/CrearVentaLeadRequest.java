package com.venta.backend.venta.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrearVentaLeadRequest {
    
    // Datos del lead de marketing
    private Integer idLeadMarketing;
    
    // Datos del cliente
    private String nombres;
    private String apellidos;
    private String correo;
    private String telefono;
    private String dni;
    
    // Datos de la campaña
    private String canalOrigen;
    private Integer idCampaniaMarketing;
    private String nombreCampania;
    private String tematica;
    private String descripcion;
    private String notasLlamada;
    private LocalDateTime fechaEnvio;
}
