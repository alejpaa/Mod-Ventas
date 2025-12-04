package com.venta.backend.venta.application.servicios;

import com.venta.backend.venta.application.dto.response.VentaListadoResponse;

import java.util.List;

public interface IVentaConsultaService {

    List<VentaListadoResponse> listarVentas();
}


