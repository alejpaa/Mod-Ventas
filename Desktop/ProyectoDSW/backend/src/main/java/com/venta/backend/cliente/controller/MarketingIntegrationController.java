package com.venta.backend.cliente.controller;

import com.venta.backend.cliente.application.dto.response.PageMarketingClienteResponse;
import com.venta.backend.cliente.application.servicios.IClienteConsultaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes/integracion/marketing")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Integración Marketing", description = "API para integración con módulo de Marketing")
public class MarketingIntegrationController {

    private final IClienteConsultaServicio consultaServicio;

    /**
     * GET /api/clientes/integracion/marketing
     * Devuelve data segmentada (RFM, demografía) para el módulo de Marketing.
     */
    @GetMapping
    @Operation(summary = "Data para Marketing", description = "Retorna clientes con score y datos analíticos.")
    public ResponseEntity<PageMarketingClienteResponse> obtenerDatosMarketing(Pageable pageable) {
        PageMarketingClienteResponse response = consultaServicio.obtenerDatosParaMarketing(pageable);
        return ResponseEntity.ok(response);
    }
}

