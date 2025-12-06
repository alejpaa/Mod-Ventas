package com.venta.backend.venta.impl;

import com.venta.backend.venta.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.dto.response.VentaResumenResponse;
import com.venta.backend.venta.exceptions.ItemProductoNoEncontradoException;
import com.venta.backend.venta.exceptions.VentaNoEncontradaException;
import com.venta.backend.venta.exceptions.VentaOperacionNoPermitidaException;
import com.venta.backend.venta.factory.VentaFactoryResolver;
import com.venta.backend.venta.mappers.IVentaMapper;
import com.venta.backend.venta.servicios.IVentaCarritoService;
import com.venta.backend.venta.entities.ItemProducto;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.repository.ItemProductoRepositorio;
import com.venta.backend.venta.repository.VentaRepositorio;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VentaCarritoServiceImpl implements IVentaCarritoService {

    private final VentaRepositorio ventaRepositorio;
    private final ItemProductoRepositorio itemProductoRepositorio;
    private final VentaFactoryResolver ventaFactoryResolver;
    private final VendedorRepositorio vendedorRepositorio;
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

        ItemProducto producto = itemProductoRepositorio.findById(request.getItemProductoId())
                .orElseThrow(() -> new ItemProductoNoEncontradoException(request.getItemProductoId()));

        venta.agregarOActualizarItem(producto, request.getCantidad());
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
        if (venta.getIdVendedor() != null) {
            String nombreVendedor = vendedorRepositorio.findById(venta.getIdVendedor())
                    .map(vendedor -> vendedor.getFirstName() + " " + vendedor.getLastName())
                    .orElse(null);
            
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

