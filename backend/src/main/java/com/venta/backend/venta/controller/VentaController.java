package com.venta.backend.venta.controller;

import com.venta.backend.venta.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.dto.request.CrearVentaLeadRequest;
import com.venta.backend.venta.dto.response.*;
import com.venta.backend.venta.servicios.IVentaCarritoService;
import com.venta.backend.venta.servicios.IVentaConsultaService;
import com.venta.backend.venta.servicios.VentaLeadService;
import com.venta.backend.venta.servicios.VentaLeadConsultaService;
import com.venta.backend.venta.servicios.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Ventas", description = "API para gestión de ventas directas y desde leads")
@RequestMapping("/api/venta")
@RestController
@RequiredArgsConstructor
public class VentaController {

    private final IVentaCarritoService ventaCarritoService;
    private final IVentaConsultaService ventaConsultaService;
    private final VentaLeadService ventaLeadService;
    private final VentaLeadConsultaService ventaLeadConsultaService;
    private final BoletaService boletaService;

    @Operation(summary = "Listar todas las ventas", description = "Obtiene un listado completo de todas las ventas sin paginación")
    @GetMapping
    public java.util.List<VentaListadoResponse> listarVentas() {
        return ventaConsultaService.listarVentas();
    }

    @Operation(summary = "Listar ventas paginadas", description = "Obtiene un listado paginado y ordenado de ventas")
    @GetMapping("/paginadas")
    public VentaPaginadaResponse listarVentasPaginadas(
            @Parameter(description = "Número de página (inicia en 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Cantidad de elementos por página") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Campo por el cual ordenar") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Dirección del ordenamiento (asc/desc)") @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ventaConsultaService.listarVentasPaginadas(page, size, sortBy, sortDir);
    }

    @Operation(summary = "Crear venta directa en borrador", description = "Crea una nueva venta directa en estado borrador")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venta creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping("/directa/borrador")
    @ResponseStatus(HttpStatus.CREATED)
    public VentaResumenResponse crearVentaDirectaBorrador(@Valid @RequestBody CrearVentaDirectaRequest request) {
        return ventaCarritoService.crearVentaDirectaBorrador(request);
    }

    @Operation(summary = "Agregar producto al carrito", description = "Agrega un producto a una venta en borrador")
    @PostMapping("/{ventaId}/carrito/items")
    public VentaResumenResponse agregarItem(
            @Parameter(description = "ID de la venta") @PathVariable Long ventaId,
            @Valid @RequestBody AgregarItemVentaRequest request
    ) {
        return ventaCarritoService.agregarItemALaVenta(ventaId, request);
    }

    @Operation(summary = "Obtener resumen de venta", description = "Obtiene el resumen completo de una venta con sus productos y totales")
    @GetMapping("/{ventaId}/carrito")
    public VentaResumenResponse obtenerResumen(
            @Parameter(description = "ID de la venta") @PathVariable Long ventaId) {
        return ventaCarritoService.obtenerResumen(ventaId);
    }

    @Operation(summary = "Asignar vendedor a venta", description = "Asigna un vendedor a una venta existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Vendedor asignado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Venta o vendedor no encontrado")
    })
    @PutMapping("/{ventaId}/vendedor/{vendedorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void asignarVendedor(
            @Parameter(description = "ID de la venta") @PathVariable Long ventaId, 
            @Parameter(description = "ID del vendedor") @PathVariable Long vendedorId) {
        ventaCarritoService.asignarVendedor(ventaId, vendedorId);
    }

    @Operation(summary = "Cancelar venta", description = "Cancela una venta cambiando su estado a CANCELADA")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Venta cancelada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    @PutMapping("/{ventaId}/cancelar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelarVenta(
            @Parameter(description = "ID de la venta a cancelar") @PathVariable Long ventaId) {
        ventaCarritoService.cancelarVenta(ventaId);
    }

    @Operation(summary = "Crear venta desde cotización", description = "Convierte una cotización en una venta confirmada, copiando productos y calculando totales")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venta creada exitosamente desde cotización"),
        @ApiResponse(responseCode = "404", description = "Cotización no encontrada")
    })
    @PostMapping("/desde-cotizacion/{cotizacionId}")
    @ResponseStatus(HttpStatus.CREATED)
    public VentaResumenResponse crearVentaDesdeCotizacion(
            @Parameter(description = "ID de la cotización a convertir en venta") @PathVariable Long cotizacionId) {
        return ventaCarritoService.crearVentaDesdeCotizacion(cotizacionId);
    }

    @Operation(summary = "Asignar cliente a venta", description = "Asigna o reemplaza el cliente de una venta existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cliente asignado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    @PutMapping("/{ventaId}/cliente/{clienteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void asignarCliente(
            @Parameter(description = "ID de la venta") @PathVariable Long ventaId,
            @Parameter(description = "ID del cliente a asignar") @PathVariable Long clienteId) {
        ventaCarritoService.asignarCliente(ventaId, clienteId);
    }

    @Operation(summary = "Crear venta desde lead de marketing", description = "Crea una nueva venta a partir de un lead generado por marketing")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venta desde lead creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping("/lead/desde-marketing")
    @ResponseStatus(HttpStatus.CREATED)
    public VentaLeadResponse crearVentaDesdeLeadMarketing(@Valid @RequestBody CrearVentaLeadRequest request) {
        return ventaLeadService.crearVentaDesdeLeadMarketing(request);
    }

    @Operation(summary = "Listar leads pendientes", description = "Obtiene todas las ventas de tipo lead que están pendientes de atención")
    @GetMapping("/leads/pendientes")
    public java.util.List<VentaLeadPendienteResponse> listarVentasLeadPendientes() {
        return ventaLeadConsultaService.listarVentasLeadPendientes();
    }

    @Operation(summary = "Obtener detalle de venta lead", description = "Obtiene el detalle completo de una venta generada desde un lead")
    @GetMapping("/leads/{ventaId}")
    public VentaLeadDetalleResponse obtenerDetalleVentaLead(
            @Parameter(description = "ID de la venta lead") @PathVariable Long ventaId) {
        return ventaLeadConsultaService.obtenerDetalleVentaLead(ventaId);
    }

    @Operation(summary = "Obtener boletas por empleado", description = "Obtiene todas las boletas de venta asociadas a un vendedor específico")
    @GetMapping("/boletas/empleado/{employeeRrhhId}")
    public java.util.List<BoletaResponse> obtenerBoletasPorEmpleado(
            @Parameter(description = "ID del empleado en RRHH") @PathVariable Long employeeRrhhId) {
        return boletaService.obtenerBoletasPorEmpleado(employeeRrhhId);
    }

    @Operation(summary = "Obtener boletas por cliente", description = "Obtiene todas las boletas de venta asociadas a un cliente específico con información detallada")
    @GetMapping("/boletas/cliente/{clienteId}")
    public java.util.List<BoletaClienteResponse> obtenerBoletasPorCliente(
            @Parameter(description = "ID del cliente") @PathVariable Long clienteId) {
        return boletaService.obtenerBoletasPorCliente(clienteId);
    }
    
    @Operation(summary = "Guardar productos de la venta", description = "Sincroniza el carrito del frontend con la base de datos (insert/update/delete) y recalcula totales")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Productos guardados exitosamente"),
        @ApiResponse(responseCode = "400", description = "Venta no es borrador"),
        @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    @PostMapping("/{ventaId}/guardar-productos")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void guardarProductos(
            @Parameter(description = "ID de la venta") @PathVariable Long ventaId,
            @RequestBody com.venta.backend.venta.dto.request.GuardarProductosRequest request) {
        ventaCarritoService.guardarProductos(ventaId, request.getProductos());
    }
    
    @Operation(summary = "Calcular totales de la venta", description = "Obtiene subtotal, descuento y total calculados en tiempo real")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Totales calculados exitosamente"),
        @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    @GetMapping("/{ventaId}/totales")
    public ResponseEntity<VentaResumenResponse> calcularTotales(@Parameter(description = "ID de la venta") @PathVariable Long ventaId) {
        return ResponseEntity.ok(ventaCarritoService.calcularTotales(ventaId));
    }
    
    @Operation(summary = "Actualizar método de pago", description = "Actualiza el método de pago de la venta (EFECTIVO o TARJETA)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Método de pago actualizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Método de pago inválido"),
        @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    @PutMapping("/{ventaId}/metodo-pago")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void actualizarMetodoPago(
            @Parameter(description = "ID de la venta") @PathVariable Long ventaId,
            @Parameter(description = "Método de pago (EFECTIVO o TARJETA)") @RequestParam String metodoPago) {
        ventaCarritoService.actualizarMetodoPago(ventaId, metodoPago);
    }
    
    @Operation(summary = "Confirmar venta", description = "Confirma una venta en borrador cambiando su estado a CONFIRMADA. Valida que tenga vendedor, cliente, método de pago y al menos 1 producto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Venta confirmada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Validación fallida o venta no es borrador"),
        @ApiResponse(responseCode = "404", description = "Venta no encontrada")
    })
    @PutMapping("/{ventaId}/confirmar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmarVenta(@Parameter(description = "ID de la venta") @PathVariable Long ventaId) {
        ventaCarritoService.confirmarVenta(ventaId);

    @Operation(summary = "Obtener ventas agregadas por canal (Físico vs. Llamada)")
    @GetMapping("/analisis/ventas-por-canal")
    public ResponseEntity<List<VentasPorCanalResponse>> obtenerVentasPorCanal() {
        return ResponseEntity.ok(ventaConsultaService.obtenerVentasPorCanal());
    }
}
