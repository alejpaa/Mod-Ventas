package com.venta.backend.cotizacion.service;

import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.exception.CotizacionNotFoundException;
import com.venta.backend.cotizacion.mapper.CotizacionMapper;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CotizacionQueryService {

    private final CotizacionRepository cotizacionRepository;
    private final CotizacionMapper cotizacionMapper;

    public List<CotizacionResponse> listarCotizaciones() {
        return cotizacionRepository.findAll().stream()
                .map(cotizacionMapper::toDto)
                .toList();
    }

    public CotizacionResponse obtenerCotizacion(Integer id) {
        return cotizacionRepository.findById(id)
                .map(cotizacionMapper::toDto)
                .orElseThrow(() -> new CotizacionNotFoundException("Cotización no encontrada"));
    }
}


