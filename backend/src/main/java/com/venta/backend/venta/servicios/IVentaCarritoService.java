package com.venta.backend.venta.servicios;

import com.venta.backend.venta.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.dto.response.VentaResumenResponse;

public interface IVentaCarritoService {

    VentaResumenResponse crearVentaDirectaBorrador(CrearVentaDirectaRequest request);

    VentaResumenResponse agregarItemALaVenta(Long ventaId, AgregarItemVentaRequest request);

    VentaResumenResponse obtenerResumen(Long ventaId);
    
    void asignarVendedor(Long ventaId, Long vendedorId);
}

