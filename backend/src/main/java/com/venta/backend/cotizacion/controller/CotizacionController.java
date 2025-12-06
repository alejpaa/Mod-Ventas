package com.venta.backend.cotizacion.controller;

import com.venta.backend.cotizacion.dto.AceptacionCotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionListResponse;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.dto.EnviarCotizacionRequest;
import com.venta.backend.cotizacion.service.CotizacionCommandService;
import com.venta.backend.cotizacion.service.CotizacionQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionQueryService cotizacionQueryService;
    private final CotizacionCommandService cotizacionCommandService;

    @GetMapping("/cotizaciones")
    public ResponseEntity<Page<CotizacionListResponse>> listarCotizaciones(
            @RequestParam(required = false) Long vendedorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaCotizacion").descending());
        return ResponseEntity.ok(cotizacionQueryService.listarCotizaciones(vendedorId, pageable));
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

    @GetMapping("/cotizaciones/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Integer id) {
        byte[] pdfBytes = cotizacionQueryService.generarPdfCotizacion(id);
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=Cotizacion_" + id + ".pdf")
                .body(pdfBytes);
    }
}

