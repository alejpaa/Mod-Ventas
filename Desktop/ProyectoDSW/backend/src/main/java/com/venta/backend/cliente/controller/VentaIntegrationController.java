package com.venta.backend.cliente.controller;

import com.venta.backend.cliente.application.dto.request.CrearClienteSimpleRequest;
import com.venta.backend.cliente.application.dto.response.ClienteIdResponse;
import com.venta.backend.cliente.application.dto.response.ClienteVentaDTO;
import com.venta.backend.cliente.application.servicios.IClienteAdminServicio;
import com.venta.backend.cliente.application.servicios.IClienteConsultaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes/integracion/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Integración Ventas", description = "API para integración con módulo de Ventas")
public class VentaIntegrationController {

    private final IClienteConsultaServicio consultaServicio;
    private final IClienteAdminServicio adminServicio;

    /**
     * GET /api/clientes/integracion/ventas/buscar/{dni}
     * Busca un cliente por DNI para realizar una venta.
     */
    @GetMapping("/buscar/{dni}")
    @Operation(summary = "Buscar Cliente para Venta", description = "Devuelve datos operativos y flag de deuda.")
    public ResponseEntity<ClienteVentaDTO> buscarClienteParaVenta(@PathVariable String dni) {
        ClienteVentaDTO response = consultaServicio.buscarClienteParaVenta(dni);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/clientes/integracion/ventas/crear
     * Crea un cliente simplificado desde el módulo de Ventas.
     * Recibe datos básicos y devuelve solo el ID generado.
     */
    @PostMapping("/crear")
    @Operation(summary = "Crear cliente simplificado", description = "Crea un cliente recibiendo datos básicos y devolviendo solo el ID generado.")
    public ResponseEntity<ClienteIdResponse> crearClienteSimple(@RequestBody CrearClienteSimpleRequest request) {
        ClienteIdResponse response = adminServicio.crearClienteSimple(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

