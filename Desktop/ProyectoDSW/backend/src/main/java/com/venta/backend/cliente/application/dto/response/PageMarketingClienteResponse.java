package com.venta.backend.cliente.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageMarketingClienteResponse {

    private List<ClienteMarketingDTO> clientes;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClienteMarketingDTO {
        private Long clienteId;
        private String dni;
        private String fullName;
        private String email;
        private String categoria;
        private String estado;
        
        // Datos RFM (Recency, Frequency, Monetary)
        private Integer recencyScore; // Días desde última compra
        private Integer frequencyScore; // Frecuencia de compras
        private BigDecimal monetaryScore; // Valor total de compras
        
        // Datos demográficos
        private String ubicacion;
        private Integer edad;
    }
}

