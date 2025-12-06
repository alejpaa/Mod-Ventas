package com.venta.backend.venta.impl;

import com.venta.backend.venta.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.dto.response.VentaResumenResponse;
import com.venta.backend.venta.exceptions.VentaNoEncontradaException;
import com.venta.backend.venta.exceptions.VentaOperacionNoPermitidaException;
import com.venta.backend.venta.factory.VentaFactoryResolver;
import com.venta.backend.venta.mappers.IVentaMapper;
import com.venta.backend.venta.servicios.IVentaCarritoService;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.entities.DetalleVenta;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import com.venta.backend.venta.repository.VentaRepositorio;
import com.venta.backend.venta.repository.VentaRepositorio;
import com.venta.backend.venta.repository.DetalleVentaRepositorio;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.DetalleCotizacion;
import com.venta.backend.cotizacion.exception.CotizacionNotFoundException;
import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class VentaCarritoServiceImpl implements IVentaCarritoService {

    private final VentaRepositorio ventaRepositorio;
    private final DetalleVentaRepositorio detalleVentaRepositorio;
    private final VentaFactoryResolver ventaFactoryResolver;
    private final VendedorRepositorio vendedorRepositorio;
    private final CotizacionRepository cotizacionRepository;
    private final ClienteRepositorio clienteRepositorio;
    @Qualifier("IVentaMapper")
    private final IVentaMapper ventaMapper;

    @Override
    @Transactional
    public VentaResumenResponse crearVentaDirectaBorrador(CrearVentaDirectaRequest request) {
        Venta venta = ventaFactoryResolver
                .getFactory(OrigenVenta.DIRECTA)
                .crearVentaBorrador();

        venta.setNumVenta(generarCodigoVenta(OrigenVenta.DIRECTA));

        Venta guardada = ventaRepositorio.save(venta);
        return ventaMapper.toResumen(guardada);
    }

    @Override
    @Transactional
    public VentaResumenResponse agregarItemALaVenta(Long ventaId, AgregarItemVentaRequest request) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));

        if (!venta.esBorrador()) {
            throw new VentaOperacionNoPermitidaException("Solo se puede modificar una venta en estado borrador.");
        }

        venta.agregarOActualizarItem(
            request.getProductoId(), 
            request.getNombreProducto(), 
            request.getPrecioUnitario(), 
            request.getCantidad()
        );
        
        Venta guardada = ventaRepositorio.save(venta);
        return ventaMapper.toResumen(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public VentaResumenResponse obtenerResumen(Long ventaId) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));
        
        VentaResumenResponse resumen = ventaMapper.toResumen(venta);
        
        // Obtener nombre del vendedor si está asignado
        String nombreVendedor = null;
        if (venta.getIdVendedor() != null) {
            nombreVendedor = vendedorRepositorio.findById(venta.getIdVendedor())
                    .map(vendedor -> vendedor.getFirstName() + " " + vendedor.getLastName())
                    .orElse(null);
        }
        
        // Obtener nombre del cliente si está asignado
        String nombreCliente = null;
        String clienteDni = null;
        String clienteEmail = null;
        String clienteTelefono = null;
        
        if (venta.getClienteId() != null) {
            var clienteOpt = clienteRepositorio.findById(venta.getClienteId());
            if (clienteOpt.isPresent()) {
                var cliente = clienteOpt.get();
                nombreCliente = cliente.getFirstName() + " " + cliente.getLastName();
                clienteDni = cliente.getDni();
                clienteEmail = cliente.getEmail();
                clienteTelefono = cliente.getPhoneNumber();
            }
        }
        
        // Si hay vendedor o cliente, reconstruir el response
        if (nombreVendedor != null || nombreCliente != null) {
            return VentaResumenResponse.builder()
                    .ventaId(resumen.getVentaId())
                    .numVenta(resumen.getNumVenta())
                    .origen(resumen.getOrigen())
                    .estado(resumen.getEstado())
                    .subtotal(resumen.getSubtotal())
                    .descuentoTotal(resumen.getDescuentoTotal())
                    .total(resumen.getTotal())
                    .idVendedor(resumen.getIdVendedor())
                    .nombreVendedor(nombreVendedor)
                    .clienteId(resumen.getClienteId())
                    .nombreCliente(nombreCliente)
                    .clienteDni(clienteDni)
                    .clienteEmail(clienteEmail)
                    .clienteTelefono(clienteTelefono)
                    .items(resumen.getItems())
                    .build();
        }
        
        return resumen;
    }

    @Override
    @Transactional
    public void asignarVendedor(Long ventaId, Long vendedorId) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));

        if (!venta.esBorrador()) {
            throw new VentaOperacionNoPermitidaException("Solo se puede asignar vendedor a una venta en estado borrador.");
        }

        venta.setIdVendedor(vendedorId);
        ventaRepositorio.save(venta);
    }

    @Override
    @Transactional
    public void cancelarVenta(Long ventaId) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));
        
        venta.setEstado(VentaEstado.CANCELADA);
        ventaRepositorio.save(venta);
    }

    @Override
    @Transactional
    public VentaResumenResponse crearVentaDesdeCotizacion(Long cotizacionId) {
        // 1. Buscar cotización
        Cotizacion cotizacion = cotizacionRepository.findById(cotizacionId.intValue())
                .orElseThrow(() -> new CotizacionNotFoundException("Cotización no encontrada con ID: " + cotizacionId));

        // 2. Crear venta
        Venta venta = Venta.builder()
                .numVenta(generarCodigoVenta(OrigenVenta.COTIZACION))
                .origenVenta(OrigenVenta.COTIZACION)
                .estado(VentaEstado.CONFIRMADA)
                .fechaVentaCreada(java.time.LocalDate.now())
                .fechaVentaCompletada(java.time.LocalDate.now())
                .clienteId(cotizacion.getCliente().getClienteId())
                .idCotizacion(cotizacionId)
                .idVendedor(cotizacion.getVendedor().getSellerId())
                .subtotal(BigDecimal.ZERO)
                .descuentoTotal(BigDecimal.ZERO)
                .total(BigDecimal.ZERO)
                .build();

        Venta ventaGuardada = ventaRepositorio.save(venta);

        // 3. Copiar productos de DetalleCotizacion a DetalleVenta
        BigDecimal subtotalCalculado = BigDecimal.ZERO;
        BigDecimal descuentoTotalCalculado = BigDecimal.ZERO;

        for (DetalleCotizacion detalle : cotizacion.getItems()) {
            DetalleVenta detalleVenta = DetalleVenta.builder()
                    .venta(ventaGuardada)
                    .idProducto(detalle.getItemProductoId())
                    .nombreProducto("Producto " + detalle.getItemProductoId()) // Placeholder - actualizar DetalleCotizacion para incluir nombre
                    .cantidad(detalle.getCantidad())
                    .precioUnitario(detalle.getPrecioUnitario())
                    .descuentoMonto(detalle.getDescuentoMonto())
                    .subtotal(detalle.getSubtotal())
                    .build();

            detalleVentaRepositorio.save(detalleVenta);

            subtotalCalculado = subtotalCalculado.add(detalle.getSubtotal());
            descuentoTotalCalculado = descuentoTotalCalculado.add(detalle.getDescuentoMonto());
        }

        // 4. Actualizar totales de la venta
        ventaGuardada.setSubtotal(subtotalCalculado);
        ventaGuardada.setDescuentoTotal(descuentoTotalCalculado);
        ventaGuardada.setTotal(subtotalCalculado.subtract(descuentoTotalCalculado));

        Venta ventaFinal = ventaRepositorio.save(ventaGuardada);

        return ventaMapper.toResumen(ventaFinal);
    }

    @Override
    @Transactional
    public void asignarCliente(Long ventaId, Long clienteId) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));
        
        venta.setClienteId(clienteId);
        ventaRepositorio.save(venta);
    }
    
    @Override
    @Transactional
    public void guardarProductos(Long ventaId) {
        // Los productos ya se guardan al agregarlos, este método recalcula totales
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));
        
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal descuentoTotal = BigDecimal.ZERO;
        
        for (DetalleVenta detalle : venta.getDetalles()) {
            subtotal = subtotal.add(detalle.getSubtotal());
            descuentoTotal = descuentoTotal.add(detalle.getDescuentoMonto());
        }
        
        venta.setSubtotal(subtotal);
        venta.setDescuentoTotal(descuentoTotal);
        venta.setTotal(subtotal.subtract(descuentoTotal));
        
        ventaRepositorio.save(venta);
    }
    
    @Override
    @Transactional(readOnly = true)
    public VentaResumenResponse calcularTotales(Long ventaId) {
        return obtenerResumen(ventaId);
    }
    
    @Override
    @Transactional
    public void actualizarMetodoPago(Long ventaId, String metodoPago) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));
        
        try {
            venta.setMetodoPago(com.venta.backend.venta.enums.MetodoPago.valueOf(metodoPago.toUpperCase()));
            ventaRepositorio.save(venta);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Método de pago inválido: " + metodoPago);
        }
    }

    private String generarCodigoVenta(OrigenVenta origenVenta) {
        String prefijoTipo;
        switch (origenVenta) {
            case LEAD -> prefijoTipo = "LED";
            case COTIZACION -> prefijoTipo = "COT";
            default -> prefijoTipo = "DIR";
        }

        String prefijo = "VTA-" + prefijoTipo + "-";

        return ventaRepositorio.findFirstByOrigenVentaOrderByIdDesc(origenVenta)
                .map(Venta::getNumVenta)
                .filter(codigo -> codigo != null && codigo.startsWith(prefijo))
                .map(codigo -> {
                    String numeroStr = codigo.substring(prefijo.length());
                    int numero = Integer.parseInt(numeroStr);
                    return prefijo + String.format("%06d", numero + 1);
                })
                .orElse(prefijo + "000001");
    }
}

