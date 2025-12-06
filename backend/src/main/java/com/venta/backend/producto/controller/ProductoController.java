package com.venta.backend.producto.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.venta.backend.producto.dto.ComboDBRequest;
import com.venta.backend.producto.dto.ProductoDBDTO;
import com.venta.backend.producto.dto.ProductoDisponibleDTO;
import com.venta.backend.producto.service.ProductoDBService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoDBService productoDBService;

    public ProductoController(ProductoDBService productoDBService) {
        this.productoDBService = productoDBService;
    }

    // --- Endpoints para el Frontend ---

    /**
     * GET /api/productos/disponibles - Productos disponibles para vendedores
     * Retorna productos con stock y activos
     */
    @GetMapping("/disponibles")
    public ResponseEntity<List<ProductoDisponibleDTO>> listarProductosDisponibles() {
        return ResponseEntity.ok(productoDBService.obtenerProductosDisponibles());
    }

    /**
     * GET /api/productos/admin/disponibles - Productos individuales para crear combos
     * Solo para administradores
     */
    @GetMapping("/admin/disponibles")
    public ResponseEntity<List<ProductoDBDTO>> listarProductosDisponiblesAdmin() {
        return ResponseEntity.ok(productoDBService.obtenerProductosIndividualesDTO());
    }

    /**
     * POST /api/productos/combos - Crear un nuevo combo
     * Aplica descuentos automáticamente: 15% equipos móviles, 10% servicios
     */
    @PostMapping("/combos")
    public ResponseEntity<ProductoDBDTO> crearCombo(@RequestBody ComboDBRequest request) {
        ProductoDBDTO nuevoCombo = productoDBService.crearCombo(request);
        return ResponseEntity.status(201).body(nuevoCombo);
    }

    /**
     * GET /api/productos/combos - Listar todos los combos creados
     */
    @GetMapping("/combos")
    public ResponseEntity<List<ProductoDBDTO>> listarCombos() {
        return ResponseEntity.ok(productoDBService.obtenerCombosDTO());
    }

    /**
     * GET /api/productos/combos/{id} - Detalle de un combo específico
     * Incluye los productos que lo componen
     */
    @GetMapping("/combos/{id}")
    public ResponseEntity<ProductoDBDTO> obtenerDetalleCombo(@PathVariable Long id) {
        return ResponseEntity.ok(productoDBService.obtenerDetalleComboDTO(id));
    }
}