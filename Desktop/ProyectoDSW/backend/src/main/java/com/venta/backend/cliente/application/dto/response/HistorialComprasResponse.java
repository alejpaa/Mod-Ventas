package com.venta.backend.cliente.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistorialComprasResponse {

    private Long clienteId;
    private String clienteNombre;
    private String categoria;
    private BigDecimal totalCompras;
    private Integer cantidadCompras;
    private List<CompraDetalle> compras;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompraDetalle {
        private Long compraId;
        private LocalDate fecha;
        private String producto;
        private BigDecimal monto;
        private String metodoPago;
    }
}

