package com.venta.backend.cliente.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageClienteResponse {

    private List<ClienteResponse> clientes;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
}

