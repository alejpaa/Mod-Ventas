package com.venta.backend.cliente.controller;

import com.venta.backend.cliente.application.dto.request.ModificacionClienteRequest;
import com.venta.backend.cliente.application.dto.response.ClienteResponse;
import com.venta.backend.cliente.application.servicios.IClienteAdminServicio;
import com.venta.backend.cliente.application.servicios.IClienteConsultaServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes/integracion/atencion-cliente")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Integración Atención al Cliente", description = "API para integración con módulo de Atención al Cliente")
public class AtencionClienteIntegrationController {

    private final IClienteConsultaServicio consultaServicio;
    private final IClienteAdminServicio adminServicio;

    /**
     * GET /api/clientes/integracion/atencion-cliente/{idCliente}
     * Obtiene la información de un cliente por su ID
     */
    @GetMapping("/{idCliente}")
    @Operation(summary = "Obtener Cliente por ID", description = "Devuelve la información completa del cliente.")
    public ResponseEntity<ClienteResponse> obtenerClientePorId(@PathVariable Long idCliente) {
        ClienteResponse response = consultaServicio.obtenerClientePorId(idCliente);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/clientes/integracion/atencion-cliente/dni/{dni}
     * Obtiene la información de un cliente por su DNI
     */
    @GetMapping("/dni/{dni}")
    @Operation(summary = "Obtener Cliente por DNI", description = "Devuelve la información completa del cliente.")
    public ResponseEntity<ClienteResponse> obtenerClientePorDni(@PathVariable String dni) {
        ClienteResponse response = consultaServicio.obtenerClientePorDni(dni);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/clientes/integracion/atencion-cliente/{idCliente}
     * Actualiza parcialmente los datos de un cliente
     * Permite modificar todos los campos excepto clienteId (que es la identidad)
     */
    @PatchMapping("/{idCliente}")
    @Operation(summary = "Actualizar Cliente", description = "Actualiza parcialmente los datos del cliente. Permite modificar todos los campos excepto clienteId (que es la identidad).")
    public ResponseEntity<ClienteResponse> actualizarCliente(
            @PathVariable Long idCliente,
            @RequestBody ModificacionClienteRequest request) {
        ClienteResponse response = adminServicio.actualizarCliente(idCliente, request);
        return ResponseEntity.ok(response);
    }
}


