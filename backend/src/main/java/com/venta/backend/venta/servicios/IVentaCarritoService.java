package com.venta.backend.venta.servicios;

import com.venta.backend.venta.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.dto.response.VentaResumenResponse;

public interface IVentaCarritoService {

    VentaResumenResponse crearVentaDirectaBorrador(CrearVentaDirectaRequest request);

    VentaResumenResponse agregarItemALaVenta(Long ventaId, AgregarItemVentaRequest request);

    VentaResumenResponse obtenerResumen(Long ventaId);
    
    void asignarVendedor(Long ventaId, Long vendedorId);
    
    void cancelarVenta(Long ventaId);
    
    VentaResumenResponse crearVentaDesdeCotizacion(Long cotizacionId);
    
    void asignarCliente(Long ventaId, Long clienteId);
    
    void guardarProductos(Long ventaId, java.util.List<com.venta.backend.venta.dto.request.GuardarProductosRequest.ProductoCarrito> productosCarrito);
    
    VentaResumenResponse calcularTotales(Long ventaId);
    
    void actualizarMetodoPago(Long ventaId, String metodoPago);
    
    void confirmarVenta(Long ventaId);
    
    byte[] generarPdfVenta(Long ventaId);
}

