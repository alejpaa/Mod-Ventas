package com.venta.backend.venta.application.impl;

import com.venta.backend.venta.application.dto.response.VentaListadoResponse;
import com.venta.backend.venta.application.dto.response.VentaPaginadaResponse;
import com.venta.backend.venta.application.mappers.IVentaMapper;
import com.venta.backend.venta.application.servicios.IVentaConsultaService;
import com.venta.backend.venta.infraestructura.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @Override
    @Transactional(readOnly = true)
    public VentaPaginadaResponse listarVentasPaginadas(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VentaListadoResponse> ventasPage = ventaRepositorio.findAll(pageable)
                .map(ventaMapper::toListado);

        return VentaPaginadaResponse.builder()
                .content(ventasPage.getContent())
                .pageNumber(ventasPage.getNumber())
                .pageSize(ventasPage.getSize())
                .totalElements(ventasPage.getTotalElements())
                .totalPages(ventasPage.getTotalPages())
                .first(ventasPage.isFirst())
                .last(ventasPage.isLast())
                .build();
    }
}




