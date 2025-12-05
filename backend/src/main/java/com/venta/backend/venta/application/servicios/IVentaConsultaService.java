package com.venta.backend.venta.application.servicios;

import com.venta.backend.venta.application.dto.response.VentaListadoResponse;
import com.venta.backend.venta.application.dto.response.VentaPaginadaResponse;

import java.util.List;

public interface IVentaConsultaService {

    List<VentaListadoResponse> listarVentas();
    
    VentaPaginadaResponse listarVentasPaginadas(int page, int size, String sortBy, String sortDir);
}


