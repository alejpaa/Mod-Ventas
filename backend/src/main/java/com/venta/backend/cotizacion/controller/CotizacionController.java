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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    /**
     * Listar cotizaciones con paginación y filtro opcional por vendedor
     */
    @Operation(summary = "Listar cotizaciones", description = "Obtiene un listado paginado de cotizaciones con filtro opcional por vendedor")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de cotizaciones obtenida exitosamente")
    })
    @GetMapping("/cotizaciones")
    public ResponseEntity<Page<CotizacionListResponse>> listarCotizaciones(
            @RequestParam(required = false) Long vendedorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaCotizacion").descending());
        return ResponseEntity.ok(cotizacionQueryService.listarCotizaciones(vendedorId, pageable));
    }

    /**
     * Crear una nueva cotización
     */
    @Operation(summary = "Crear cotización", description = "Crea una nueva cotización con los datos proporcionados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Cotización creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping("/cotizaciones")
    public ResponseEntity<CotizacionResponse> crearCotizacion(@Valid @RequestBody CotizacionRequest request) {
        CotizacionResponse response = cotizacionCommandService.crearCotizacion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Obtener detalles de una cotización por ID
     */
    @Operation(summary = "Obtener cotización", description = "Obtiene los detalles completos de una cotización específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cotización encontrada"),
        @ApiResponse(responseCode = "404", description = "Cotización no encontrada")
    })
    @GetMapping("/cotizaciones/{id}")
    public ResponseEntity<CotizacionResponse> obtenerCotizacion(@PathVariable Integer id) {
        return ResponseEntity.ok(cotizacionQueryService.obtenerCotizacion(id));
    }

    /**
     * Aceptar una cotización (endpoint API)
     */
    @Operation(summary = "Aceptar cotización", description = "Marca una cotización como aceptada")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cotización aceptada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cotización no encontrada"),
        @ApiResponse(responseCode = "400", description = "La cotización ya fue aceptada")
    })
    @PostMapping("/cotizaciones/{id}/aceptacion")
    public ResponseEntity<Void> aceptarCotizacion(
            @PathVariable Integer id,
            @Valid @RequestBody AceptacionCotizacionRequest request) {
        cotizacionCommandService.aceptarCotizacion(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Enviar cotización por email con PDF adjunto
     */
    @Operation(summary = "Enviar cotización por email", description = "Envía la cotización al email especificado con el PDF adjunto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cotización enviada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cotización no encontrada")
    })
    @PostMapping("/cotizaciones/enviar")
    public ResponseEntity<Void> enviarCotizacion(@Valid @RequestBody EnviarCotizacionRequest request) {
        cotizacionCommandService.enviarCotizacion(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Descargar PDF de la cotización
     */
    @Operation(summary = "Descargar PDF", description = "Genera y descarga el PDF de la cotización")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "PDF generado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cotización no encontrada")
    })
    @GetMapping("/cotizaciones/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Integer id) {
        byte[] pdfBytes = cotizacionQueryService.generarPdfCotizacion(id);
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=Cotizacion_" + id + ".pdf")
                .body(pdfBytes);
    }

    /**
     * Aceptar cotización directamente desde email (página HTML)
     */
    @Operation(summary = "Aceptar cotización desde email", description = "Endpoint para aceptar cotización directamente desde el enlace del email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Página de aceptación mostrada")
    })
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

    /**
     * Mostrar página de éxito después de aceptar cotización
     */
    @Operation(summary = "Página de éxito", description = "Muestra la página de confirmación después de aceptar una cotización")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Página de éxito mostrada")
    })
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

