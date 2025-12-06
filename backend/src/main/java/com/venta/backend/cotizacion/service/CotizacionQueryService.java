package com.venta.backend.cotizacion.service;

import com.venta.backend.cotizacion.dto.CotizacionListResponse;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.exception.CotizacionNotFoundException;
import com.venta.backend.cotizacion.infraestructura.pdf.CotizacionPdfTemplate;
import com.venta.backend.cotizacion.infraestructura.pdf.IPdfGenerator;
import com.venta.backend.cotizacion.mapper.CotizacionMapper;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CotizacionQueryService {

    private final CotizacionRepository cotizacionRepository;
    private final CotizacionMapper cotizacionMapper;
    private final IPdfGenerator pdfGenerator;
    private final CotizacionPdfTemplate pdfTemplate;

    /**
     * Lista todas las cotizaciones con paginación.
     * Si se proporciona vendedorId, filtra por ese vendedor.
     */
    public Page<CotizacionListResponse> listarCotizaciones(Long vendedorId, Pageable pageable) {
        if (vendedorId != null) {
            return cotizacionRepository.findByVendedor_SellerId(vendedorId, pageable)
                    .map(cotizacionMapper::toListDto);
        }
        return cotizacionRepository.findAllBy(pageable)
                .map(cotizacionMapper::toListDto);
    }

    public CotizacionResponse obtenerCotizacion(Integer id) {
        return cotizacionRepository.findById(id)
                .map(cotizacionMapper::toDto)
                .orElseThrow(() -> new CotizacionNotFoundException("Cotización no encontrada con ID: " + id));
    }

    /**
     * Genera el PDF de una cotización para descarga.
     */
    public byte[] generarPdfCotizacion(Integer id) {
        Cotizacion cotizacion = cotizacionRepository.findById(id)
                .orElseThrow(() -> new CotizacionNotFoundException("Cotización no encontrada con ID: " + id));
        
        // Generate HTML from quotation data
        String htmlContent = pdfTemplate.generateHtml(cotizacion);
        
        // Generate PDF using the adapter
        return pdfGenerator.generatePdf(htmlContent);
    }
}
