package com.venta.backend.cliente.controller;

import com.venta.backend.cliente.application.dto.request.RegistroClienteRequest;
import com.venta.backend.cliente.application.dto.request.ModificacionClienteRequest;
import com.venta.backend.cliente.application.dto.response.ClienteResponse;
import com.venta.backend.cliente.application.dto.response.HistorialComprasResponse;
import com.venta.backend.cliente.application.dto.response.PageClienteResponse;
import com.venta.backend.cliente.application.servicios.IClienteAdminServicio;
import com.venta.backend.cliente.application.servicios.IClienteConsultaServicio;
import com.venta.backend.cliente.enums.EstadoClienteEnum;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Clientes", description = "API para gestión de clientes")
public class ClienteController {

    private final IClienteAdminServicio adminServicio;
    private final IClienteConsultaServicio consultaServicio;

    /**
     * POST /api/clientes/registroClientes
     * Registra un nuevo cliente
     */
    @PostMapping("/registroClientes")
    @Operation(summary = "Registrar Cliente", description = "Crea un cliente nuevo validando DNI y deudas.")
    public ResponseEntity<ClienteResponse> registrarCliente(@RequestBody RegistroClienteRequest request) {
        ClienteResponse response = adminServicio.registrarCliente(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/clientes/actualizacionClientes/{id}
     * Actualiza datos permitidos de un cliente existente
     */
    @PutMapping("/actualizacionClientes/{id}")
    @Operation(summary = "Actualizar Cliente", description = "Actualiza datos o cambia estado.")
    public ResponseEntity<ClienteResponse> actualizarCliente(
            @PathVariable Long id,
            @RequestBody ModificacionClienteRequest request) {
        ClienteResponse response = adminServicio.actualizarCliente(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/clientes/filtroClientes
     * Busca clientes con filtros y paginación
     */
    @GetMapping("/filtroClientes")
    @Operation(summary = "Filtrar Clientes", description = "Búsqueda paginada por criterios.")
    public ResponseEntity<PageClienteResponse> filtrarClientes(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) EstadoClienteEnum estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageClienteResponse response = consultaServicio.filtrarClientes(filtro, estado, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/clientes/HistorialCompras/{id}
     * Obtiene el historial financiero y transacciones
     */
    @GetMapping("/HistorialCompras/{id}")
    @Operation(summary = "Historial de Compras", description = "Obtiene detalle financiero.")
    public ResponseEntity<HistorialComprasResponse> obtenerHistorial(@PathVariable Long id) {
        HistorialComprasResponse response = consultaServicio.obtenerHistorial(id);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/clientes/{id}
     * Da de baja (desactiva) un cliente
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Dar de Baja Cliente", description = "Desactiva un cliente validando que no tenga deudas ni equipos pendientes.")
    public ResponseEntity<Void> darBajaCliente(@PathVariable Long id) {
        adminServicio.darBajaCliente(id);
        return ResponseEntity.noContent().build();
    }
}

