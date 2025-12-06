package com.venta.backend.cotizacion.controller;

import com.venta.backend.cotizacion.dto.AceptacionCotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionListResponse;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.dto.EnviarCotizacionRequest;
import com.venta.backend.cotizacion.infraestructura.html.CotizacionHtmlTemplate;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
import com.venta.backend.cotizacion.service.CotizacionCommandService;
import com.venta.backend.cotizacion.service.CotizacionQueryService;

import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Cotizaciones")
@RequestMapping("/api")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionQueryService cotizacionQueryService;
    private final CotizacionCommandService cotizacionCommandService;
    private final CotizacionRepository cotizacionRepository;
    private final CotizacionHtmlTemplate htmlTemplate;

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

    @GetMapping("/cotizaciones/{id}/aceptacion")
    public ResponseEntity<String> aceptarCotizacionDirecto(@PathVariable Integer id) {
        Cotizacion cotizacion = cotizacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
        
        // Auto-accept the quotation
        try {
            if (cotizacion.getEstado() != com.venta.backend.cotizacion.model.CotizacionEstado.ACEPTADA) {
                cotizacion.setEstado(com.venta.backend.cotizacion.model.CotizacionEstado.ACEPTADA);
                cotizacionRepository.save(cotizacion);
            }
        } catch (Exception e) {
            // If already accepted or error, continue to show success page
        }
        
        // Show processing page that auto-redirects to success
        String html = htmlTemplate.generateAutoAcceptPage(cotizacion);
        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(html);
    }

    @GetMapping("/cotizaciones/{id}/aceptacion/exito")
    public ResponseEntity<String> mostrarPaginaExito(@PathVariable Integer id) {
        Cotizacion cotizacion = cotizacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
        
        String html = htmlTemplate.generateSuccessPage(cotizacion);
        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(html);
    }
}

