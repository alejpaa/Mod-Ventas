package com.venta.backend.producto.dto;

import com.venta.backend.producto.enums.TipoProducto;
import com.venta.backend.producto.model.IProductoComponent;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// DTO para mostrar tanto Productos como Combos (gracias al Composite)
@Data
@Builder
public class ProductoDTO {
    private UUID id;
    private String nombre;
    private TipoProducto tipo;
    private BigDecimal precioBase;
    private BigDecimal precioFinal;
    private String informacionAdicional;
    private BigDecimal descuentoTotal;
    private List<ProductoDTO> componentes; // Solo para Combos

    public static ProductoDTO fromComponent(IProductoComponent component) {
        ProductoDTO.ProductoDTOBuilder builder = ProductoDTO.builder()
                .id(component.getId())
                .nombre(component.getNombre())
                .tipo(component.getTipo())
                .precioBase(component.getPrecioBase())
                .precioFinal(component.getPrecioFinal())
                .informacionAdicional(component.getInformacionAdicional());

        if (component.getTipo() == TipoProducto.COMBO && component instanceof com.venta.backend.producto.model.ComboComposite) {
            com.venta.backend.producto.model.ComboComposite combo = (com.venta.backend.producto.model.ComboComposite) component;
            builder.descuentoTotal(combo.getDescuentoTotal());
            builder.componentes(combo.getComponentes().stream()
                    .map(ProductoDTO::fromComponent)
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }
}