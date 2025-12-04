package com.venta.backend.venta.application.controller;

import com.venta.backend.venta.application.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.application.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.application.dto.response.VentaResumenResponse;
import com.venta.backend.venta.application.dto.response.VentaListadoResponse;
import com.venta.backend.venta.application.servicios.IVentaCarritoService;
import com.venta.backend.venta.application.servicios.IVentaConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/venta")
@RestController
@RequiredArgsConstructor
public class VentaController {

    private final IVentaCarritoService ventaCarritoService;
    private final IVentaConsultaService ventaConsultaService;

    @GetMapping
    public java.util.List<VentaListadoResponse> listarVentas() {
        return ventaConsultaService.listarVentas();
    }

    @PostMapping("/directa/borrador")
    @ResponseStatus(HttpStatus.CREATED)
    public VentaResumenResponse crearVentaDirectaBorrador(@Valid @RequestBody CrearVentaDirectaRequest request) {
        return ventaCarritoService.crearVentaDirectaBorrador(request);
    }

    @PostMapping("/{ventaId}/carrito/items")
    public VentaResumenResponse agregarItem(
            @PathVariable Long ventaId,
            @Valid @RequestBody AgregarItemVentaRequest request
    ) {
        return ventaCarritoService.agregarItemALaVenta(ventaId, request);
    }

    @GetMapping("/{ventaId}/carrito")
    public VentaResumenResponse obtenerResumen(@PathVariable Long ventaId) {
        return ventaCarritoService.obtenerResumen(ventaId);
    }
}
