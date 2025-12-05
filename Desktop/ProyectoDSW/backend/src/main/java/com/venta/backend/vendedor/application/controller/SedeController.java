package com.venta.backend.vendedor.application.controller;

import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.infraestructura.repository.SedeRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para consultar sedes
 * Solo lectura - no hay CRUD de sedes
 */
@RestController
@RequestMapping("/api/sedes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SedeController {
    private final SedeRepositorio sedeRepositorio;

    /**
     * GET /api/sedes
     * Lista todas las sedes disponibles
     */
    @GetMapping
    public ResponseEntity<List<Sede>> listAllBranches() {
        List<Sede> sedes = sedeRepositorio.findAll();
        return ResponseEntity.ok(sedes);
    }

    /**
     * GET /api/sedes/activas
     * Lista solo las sedes activas (útil para formularios)
     */
    @GetMapping("/activas")
    public ResponseEntity<List<Sede>> listActiveBranches() {
        List<Sede> sedes = sedeRepositorio.findByActive(true);
        return ResponseEntity.ok(sedes);
    }

    /**
     * GET /api/sedes/{id}
     * Obtiene una sede específica por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Sede> getBranchById(@PathVariable Long id) {
        Sede sede = sedeRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Sede no encontrada"));
        return ResponseEntity.ok(sede);
    }
}
