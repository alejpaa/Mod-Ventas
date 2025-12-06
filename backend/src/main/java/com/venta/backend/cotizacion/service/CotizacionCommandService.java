package com.venta.backend.cotizacion.service;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import com.venta.backend.cotizacion.dto.AceptacionCotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.dto.EnviarCotizacionRequest;
import com.venta.backend.cotizacion.exception.CotizacionNotFoundException;
import com.venta.backend.cotizacion.exception.CotizacionStateException;
import com.venta.backend.cotizacion.mapper.CotizacionMapper;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.CotizacionEstado;
import com.venta.backend.cotizacion.model.DetalleCotizacion;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
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
            DetalleCotizacion item = cotizacionMapper.toEntity(itemRequest);
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
        
        cotizacion.setEstado(CotizacionEstado.ENVIADA);
        String enlace = "/cotizaciones/" + cotizacion.getId() + "/aceptacion";
        cotizacionEmailService.enviarCotizacion(cotizacion, request.getEmail(), enlace);
        cotizacionRepository.save(cotizacion);
    }
}


