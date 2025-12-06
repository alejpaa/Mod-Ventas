package com.venta.backend.cotizacion.service;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import com.venta.backend.cotizacion.dto.AceptacionCotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.dto.EnviarCotizacionRequest;
import com.venta.backend.cotizacion.exception.CotizacionNotFoundException;
import com.venta.backend.cotizacion.exception.CotizacionStateException;
import com.venta.backend.cotizacion.infraestructura.pdf.CotizacionPdfTemplate;
import com.venta.backend.cotizacion.infraestructura.pdf.IPdfGenerator;
import com.venta.backend.cotizacion.mapper.CotizacionMapper;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.CotizacionEstado;
import com.venta.backend.cotizacion.model.DetalleCotizacion;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
import com.venta.backend.producto.entity.Producto;
import com.venta.backend.producto.repository.ProductoRepository;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CotizacionCommandService {

    private final CotizacionRepository cotizacionRepository;
    private final CotizacionMapper cotizacionMapper;
    private final CotizacionEmailService cotizacionEmailService;
    private final ClienteRepositorio clienteRepositorio;
    private final VendedorRepositorio vendedorRepositorio;
    private final ProductoRepository productoRepository;
    private final IPdfGenerator pdfGenerator;
    private final CotizacionPdfTemplate pdfTemplate;

    @Transactional
    public CotizacionResponse crearCotizacion(CotizacionRequest request) {
        // Buscar cliente y vendedor
        Cliente cliente = clienteRepositorio.findById(request.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + request.getClienteId()));
        
        Vendedor vendedor = vendedorRepositorio.findById(request.getVendedorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendedor no encontrado con ID: " + request.getVendedorId()));
        
        Cotizacion cotizacion = cotizacionMapper.toEntity(request);
        
        // Establecer las relaciones
        cotizacion.setCliente(cliente);
        cotizacion.setVendedor(vendedor);
        
        // Generate unique quotation number (simplified - you may want to implement a better strategy)
        cotizacion.setNumCotizacion("COT-" + System.currentTimeMillis());
        
        cotizacion.setTotalCotizado(BigDecimal.ZERO);
        cotizacion.clearItems();
        
        request.getItems().forEach(itemRequest -> {
            // Validate product exists
            Producto producto = productoRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + itemRequest.getProductoId()));
            
            DetalleCotizacion item = cotizacionMapper.toEntity(itemRequest);
            
            // Set the producto relationship
            item.setProducto(producto);
            
            BigDecimal subtotal = item.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(item.getCantidad()))
                .subtract(item.getDescuentoMonto() != null ? item.getDescuentoMonto() : BigDecimal.ZERO);
            item.setSubtotal(subtotal);
            cotizacion.addItem(item);
        });
        
        BigDecimal totalCotizado = cotizacion.getItems().stream()
                .map(DetalleCotizacion::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        cotizacion.setTotalCotizado(totalCotizado);
        
        return cotizacionMapper.toDto(cotizacionRepository.save(cotizacion));
    }

    @Transactional
    public void aceptarCotizacion(Integer id, AceptacionCotizacionRequest request) {
        Cotizacion cotizacion = cotizacionRepository.findById(id)
                .orElseThrow(() -> new CotizacionNotFoundException("Cotización no encontrada"));
        
        if (cotizacion.getEstado() == CotizacionEstado.ACEPTADA) {
            throw new CotizacionStateException("La cotización ya fue aceptada");
        }
        
        cotizacion.setEstado(CotizacionEstado.ACEPTADA);
        cotizacionRepository.save(cotizacion);
    }

    @Transactional
    public void enviarCotizacion(EnviarCotizacionRequest request) {
        Cotizacion cotizacion = cotizacionRepository.findById(request.getCotizacionId())
                .orElseThrow(() -> new CotizacionNotFoundException("Cotización no encontrada"));
        
        // Generate HTML from quotation data
        String htmlContent = pdfTemplate.generateHtml(cotizacion);
        
        // Generate PDF using the adapter
        byte[] pdfBytes = pdfGenerator.generatePdf(htmlContent);
        
        // Update state and send email with PDF attachment
        cotizacion.setEstado(CotizacionEstado.ENVIADA);
        String enlace = "https://mod-ventas.onrender.com/api/cotizaciones/" + cotizacion.getId() + "/aceptacion";
        cotizacionEmailService.enviarCotizacionConPdf(cotizacion, request.getEmail(), enlace, pdfBytes);
        cotizacionRepository.save(cotizacion);
    }
}


