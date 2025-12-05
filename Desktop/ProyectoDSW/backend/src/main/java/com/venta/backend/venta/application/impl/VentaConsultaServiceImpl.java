package com.venta.backend.venta.application.impl;

import com.venta.backend.venta.application.dto.response.VentaListadoResponse;
import com.venta.backend.venta.application.mappers.IVentaMapper;
import com.venta.backend.venta.application.servicios.IVentaConsultaService;
import com.venta.backend.venta.infraestructura.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaConsultaServiceImpl implements IVentaConsultaService {

    private final VentaRepositorio ventaRepositorio;
    private final IVentaMapper ventaMapper;

    @Override
    @Transactional(readOnly = true)
    public List<VentaListadoResponse> listarVentas() {
        return ventaRepositorio.findAll()
                .stream()
                .map(ventaMapper::toListado)
                .toList();
    }
}


