package com.venta.backend.venta.servicios;

import com.venta.backend.venta.dto.response.VentaListadoResponse;
import com.venta.backend.venta.dto.response.VentaPaginadaResponse;
import com.venta.backend.venta.dto.response.VentasPorCanalResponse;

import java.util.List;

public interface IVentaConsultaService {

    List<VentaListadoResponse> listarVentas();
    
    VentaPaginadaResponse listarVentasPaginadas(int page, int size, String sortBy, String sortDir);

    public List<VentasPorCanalResponse> obtenerVentasPorCanal();
}


