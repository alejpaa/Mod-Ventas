package com.venta.backend.venta.application.impl;

import com.venta.backend.venta.application.dto.request.AgregarItemVentaRequest;
import com.venta.backend.venta.application.dto.request.CrearVentaDirectaRequest;
import com.venta.backend.venta.application.dto.response.VentaResumenResponse;
import com.venta.backend.venta.application.exceptions.ItemProductoNoEncontradoException;
import com.venta.backend.venta.application.exceptions.VentaNoEncontradaException;
import com.venta.backend.venta.application.exceptions.VentaOperacionNoPermitidaException;
import com.venta.backend.venta.application.factory.VentaDraftData;
import com.venta.backend.venta.application.factory.VentaFactoryResolver;
import com.venta.backend.venta.application.mappers.IVentaMapper;
import com.venta.backend.venta.application.servicios.IVentaCarritoService;
import com.venta.backend.venta.entities.ItemProducto;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.infraestructura.repository.ItemProductoRepositorio;
import com.venta.backend.venta.infraestructura.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VentaCarritoServiceImpl implements IVentaCarritoService {

    private final VentaRepositorio ventaRepositorio;
    private final ItemProductoRepositorio itemProductoRepositorio;
    private final VentaFactoryResolver ventaFactoryResolver;
    private final IVentaMapper ventaMapper;

    @Override
    @Transactional
    public VentaResumenResponse crearVentaDirectaBorrador(CrearVentaDirectaRequest request) {
        Venta venta = ventaFactoryResolver
                .getFactory(OrigenVenta.DIRECTA)
                .crearVentaBorrador(new VentaDraftData(OrigenVenta.DIRECTA, request.getUsuarioCreador()));

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
        return ventaMapper.toResumen(venta);
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

