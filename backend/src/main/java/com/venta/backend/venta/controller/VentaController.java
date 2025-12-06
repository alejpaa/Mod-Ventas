package com.venta.backend.venta.controller;

import com.venta.backend.venta.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.dto.request.CrearVentaLeadRequest;
import com.venta.backend.venta.dto.response.VentaResumenResponse;
import com.venta.backend.venta.dto.response.VentaListadoResponse;
import com.venta.backend.venta.dto.response.VentaLeadResponse;
import com.venta.backend.venta.dto.response.VentaLeadPendienteResponse;
import com.venta.backend.venta.dto.response.VentaLeadDetalleResponse;
import com.venta.backend.venta.dto.response.BoletaResponse;
import com.venta.backend.venta.dto.response.BoletaClienteResponse;
import com.venta.backend.venta.dto.response.VentaPaginadaResponse;
import com.venta.backend.venta.servicios.IVentaCarritoService;
import com.venta.backend.venta.servicios.IVentaConsultaService;
import com.venta.backend.venta.servicios.VentaLeadService;
import com.venta.backend.venta.servicios.VentaLeadConsultaService;
import com.venta.backend.venta.servicios.BoletaService;
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
    private final VentaLeadService ventaLeadService;
    private final VentaLeadConsultaService ventaLeadConsultaService;
    private final BoletaService boletaService;

    @GetMapping
    public java.util.List<VentaListadoResponse> listarVentas() {
        return ventaConsultaService.listarVentas();
    }

    @GetMapping("/paginadas")
    public VentaPaginadaResponse listarVentasPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ventaConsultaService.listarVentasPaginadas(page, size, sortBy, sortDir);
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

    @PutMapping("/{ventaId}/vendedor/{vendedorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void asignarVendedor(@PathVariable Long ventaId, @PathVariable Long vendedorId) {
        ventaCarritoService.asignarVendedor(ventaId, vendedorId);
    }

    @PostMapping("/lead/desde-marketing")
    @ResponseStatus(HttpStatus.CREATED)
    public VentaLeadResponse crearVentaDesdeLeadMarketing(@Valid @RequestBody CrearVentaLeadRequest request) {
        return ventaLeadService.crearVentaDesdeLeadMarketing(request);
    }

    @GetMapping("/leads/pendientes")
    public java.util.List<VentaLeadPendienteResponse> listarVentasLeadPendientes() {
        return ventaLeadConsultaService.listarVentasLeadPendientes();
    }

    @GetMapping("/leads/{ventaId}")
    public VentaLeadDetalleResponse obtenerDetalleVentaLead(@PathVariable Long ventaId) {
        return ventaLeadConsultaService.obtenerDetalleVentaLead(ventaId);
    }

    @GetMapping("/boletas/empleado/{employeeRrhhId}")
    public java.util.List<BoletaResponse> obtenerBoletasPorEmpleado(@PathVariable Long employeeRrhhId) {
        return boletaService.obtenerBoletasPorEmpleado(employeeRrhhId);
    }

    @GetMapping("/boletas/cliente/{clienteId}")
    public java.util.List<BoletaClienteResponse> obtenerBoletasPorCliente(@PathVariable Long clienteId) {
        return boletaService.obtenerBoletasPorCliente(clienteId);
    }
}
