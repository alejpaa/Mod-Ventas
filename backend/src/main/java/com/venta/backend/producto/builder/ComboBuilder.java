package com.venta.backend.producto.builder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.venta.backend.producto.dto.ComboRequest;
import com.venta.backend.producto.enums.TipoProducto;
import com.venta.backend.producto.model.ComboComposite;
import com.venta.backend.producto.model.ProductoLeaf;
import com.venta.backend.producto.repository.IProductoComponentRepository;

// Builder Pattern: Concrete Builder
@Component
public class ComboBuilder {

    private final IProductoComponentRepository productoRepository;

    public ComboBuilder(IProductoComponentRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    private ComboComposite combo;
    private ComboRequest request;

    public ComboBuilder reset() {
        this.combo = null;
        this.request = null;
        return this;
    }

    public ComboBuilder withRequest(ComboRequest request) {
        this.request = request;
        this.combo = new ComboComposite(UUID.randomUUID(), request.getNombre());
        return this;
    }

    public ComboBuilder buildComponentesConDescuento() {
        if (request == null || combo == null) {
            throw new IllegalStateException("Debe inicializar el builder con un request primero.");
        }

        request.getProductosIds().forEach(productoId -> {
            ProductoLeaf producto = productoRepository.findProductoLeafById(productoId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

            BigDecimal precioBase = producto.getPrecioBase();
            BigDecimal descuento = BigDecimal.ZERO;

            // Aplicar descuentos
            if (producto.getTipo() == TipoProducto.EQUIPO_MOVIL) {
                // 15% de descuento para equipos móviles
                descuento = precioBase.multiply(new BigDecimal("0.15"));
            } else if (producto.getTipo() == TipoProducto.SERVICIO_HOGAR || producto.getTipo() == TipoProducto.SERVICIO_MOVIL) {
                // 10% de descuento al costo mensual en caso de servicios
                descuento = precioBase.multiply(new BigDecimal("0.10"));
            }

            BigDecimal precioFinal = precioBase.subtract(descuento).setScale(2, RoundingMode.HALF_UP);

            // Crear una nueva instancia de ProductoLeaf con el precio final calculado
            ProductoLeaf productoConDescuento = ProductoLeaf.builder()
                    .id(producto.getId())
                    .nombre(producto.getNombre())
                    .precioBase(producto.getPrecioBase())
                    .tipo(producto.getTipo())
                    .informacionAdicional(producto.getInformacionAdicional())
                    .precioFinal(precioFinal) // Establece el precio con descuento
                    .build();

            combo.agregarComponente(productoConDescuento);
        });
        return this;
    }

    public ComboComposite getResult() {
        if (combo == null) {
            throw new IllegalStateException("El combo no ha sido construido.");
        }
        return this.combo;
    }
}