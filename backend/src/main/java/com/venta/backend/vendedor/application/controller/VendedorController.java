package com.venta.backend.vendedor.application.controller;

import com.venta.backend.vendedor.application.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.application.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.application.dto.response.VendedorResponse;
import com.venta.backend.vendedor.application.servicios.IVendedorAdminService;
import com.venta.backend.vendedor.application.servicios.IVendedorConsultaService;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.enums.SellerType;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendedores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite CORS para desarrollo
@Slf4j
public class VendedorController {
    private final IVendedorAdminService adminServicio;
    private final IVendedorConsultaService consultaServicio;

    /**
     * POST /api/vendedores
     * Registra un nuevo vendedor (Interno o Externo)
     */
    @PostMapping
    public ResponseEntity<VendedorResponse> createSeller(@RequestBody RegistroVendedorRequest request) {
        // Registrar el inicio de la operación y el tipo de vendedor
        log.info("REST: Solicitud de creación de Vendedor de tipo: {}", request.getSellerType());
        VendedorResponse response = adminServicio.createSeller(request);
        // Registrar el inicio de la operación y el tipo de vendedor
        log.info("Vendedor {} creado con ID: {}", response.getFullName(), response.getSellerId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/vendedores/{id}
     * Modifica un vendedor existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<VendedorResponse> updateSeller(
            @PathVariable Long id,
            @RequestBody ModificacionVendedorRequest request) {
        VendedorResponse response = adminServicio.updateSeller(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/vendedores/{id}
     * Da de baja (desactiva) un vendedor
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateSeller(@PathVariable Long id) {
        adminServicio.deactivateSeller(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/vendedores/{id}/reactivar
     * Reactiva un vendedor inactivo
     */
    @PostMapping("/{id}/reactivar")
    public ResponseEntity<VendedorResponse> reactivateSeller(@PathVariable Long id) {
        VendedorResponse response = adminServicio.reactivateSeller(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/vendedores/{id}
     * Obtiene un vendedor por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VendedorResponse> getSellerById(@PathVariable Long id) {
        log.debug("REST: Búsqueda de vendedor por ID: {}", id);
        VendedorResponse response = consultaServicio.findSellerById(id);
        log.debug("Vendedor encontrado: {}", response.getSellerId());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/vendedores/dni/{dni}
     * Busca un vendedor por DNI
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<VendedorResponse> getSellerByDni(@PathVariable String dni) {
        VendedorResponse response = consultaServicio.findSellerByDni(dni);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/vendedores
     * Busca vendedores con filtros y paginación
     * Ejemplos:
     * - GET /api/vendedores?page=0&size=10
     * - GET /api/vendedores?sellerType=INTERNAL&page=0&size=20
     * - GET /api/vendedores?sellerStatus=ACTIVE&sellerBranchId=1
     * - GET /api/vendedores?dni=12345678
     */
    @GetMapping
    public ResponseEntity<Page<VendedorResponse>> searchSellers(
            @RequestParam(required = false) SellerType sellerType,
            @RequestParam(required = false) SellerStatus sellerStatus,
            @RequestParam(required = false) Long sellerBranchId,
            @RequestParam(required = false) String dni,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<VendedorResponse> response = consultaServicio.searchSellers(
                sellerType, sellerStatus, sellerBranchId, dni, pageable
        );
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/vendedores/activos
     * Lista todos los vendedores activos (sin paginación)
     */
    @GetMapping("/activos")
    public ResponseEntity<List<VendedorResponse>> listActiveSellers() {
        List<VendedorResponse> response = consultaServicio.listActiveSellers();
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/vendedores/rrhh-employee/{dni}
     * Busca los datos de un empleado en RRHH para autocompletar el formulario.
     */
    @GetMapping("/rrhh-employee/{dni}")
    public ResponseEntity<EmpleadoRRHHDTO> getRrhhEmployeeData(@PathVariable String dni) {
        EmpleadoRRHHDTO response = consultaServicio.fetchRrhhEmployee(dni);
        return ResponseEntity.ok(response);
    }
}
