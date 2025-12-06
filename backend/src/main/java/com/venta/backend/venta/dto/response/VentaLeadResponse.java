package com.venta.backend.venta.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaLeadResponse {
    
    private Long ventaId;
    private String numVenta;
    private Long clienteId;
    private String mensaje;
}
