package com.venta.backend.cotizacion.controller;

import com.venta.backend.cotizacion.dto.AceptacionCotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.dto.EnviarCotizacionRequest;
import com.venta.backend.cotizacion.service.CotizacionCommandService;
import com.venta.backend.cotizacion.service.CotizacionQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionQueryService cotizacionQueryService;
    private final CotizacionCommandService cotizacionCommandService;

    @GetMapping("/cotizaciones")
    public ResponseEntity<List<CotizacionResponse>> listarCotizaciones() {
        return ResponseEntity.ok(cotizacionQueryService.listarCotizaciones());
    }

    @PostMapping("/cotizaciones")
    public ResponseEntity<CotizacionResponse> crearCotizacion(@Valid @RequestBody CotizacionRequest request) {
        CotizacionResponse response = cotizacionCommandService.crearCotizacion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/cotizaciones/{id}")
    public ResponseEntity<CotizacionResponse> obtenerCotizacion(@PathVariable Integer id) {
        return ResponseEntity.ok(cotizacionQueryService.obtenerCotizacion(id));
    }

    @PostMapping("/cotizaciones/{id}/aceptacion")
    public ResponseEntity<Void> aceptarCotizacion(
            @PathVariable Integer id,
            @Valid @RequestBody AceptacionCotizacionRequest request) {
        cotizacionCommandService.aceptarCotizacion(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cotizaciones/enviar")
    public ResponseEntity<Void> enviarCotizacion(@Valid @RequestBody EnviarCotizacionRequest request) {
        cotizacionCommandService.enviarCotizacion(request);
        return ResponseEntity.ok().build();
    }
}

