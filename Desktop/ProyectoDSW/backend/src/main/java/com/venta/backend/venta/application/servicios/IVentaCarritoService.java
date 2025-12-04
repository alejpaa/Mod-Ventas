package com.venta.backend.venta.application.servicios;

import com.venta.backend.venta.application.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.application.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.application.dto.response.VentaResumenResponse;

public interface IVentaCarritoService {

    VentaResumenResponse crearVentaDirectaBorrador(CrearVentaDirectaRequest request);

    VentaResumenResponse agregarItemALaVenta(Long ventaId, AgregarItemVentaRequest request);

    VentaResumenResponse obtenerResumen(Long ventaId);
}

