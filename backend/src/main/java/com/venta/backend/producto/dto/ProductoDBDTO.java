package com.venta.backend.producto.dto;

import java.math.BigDecimal;
import java.util.List;

import com.venta.backend.producto.entity.Producto;
import com.venta.backend.producto.enums.TipoProducto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para productos y combos usando Long como ID
 * Compatible con la base de datos
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDBDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private TipoProducto tipo;
    private BigDecimal precioBase;
    private BigDecimal precioFinal;
    private String informacionAdicional;
    private BigDecimal descuentoTotal;
    private String imagenUrl;
    private List<ProductoDBDTO> componentes; // Solo para Combos

    /**
     * Convierte una entidad Producto a ProductoDBDTO
     */
    public static ProductoDBDTO fromEntity(Producto producto) {
        return ProductoDBDTO.builder()
                .id(producto.getId())
                .codigo(producto.getCodigo())
                .nombre(producto.getNombre())
                .tipo(producto.getTipo())
                .precioBase(producto.getPrecioBase())
                .precioFinal(producto.getPrecioFinal())
                .informacionAdicional(producto.getInformacionAdicional())
                .descuentoTotal(producto.getDescuentoTotal())
                .imagenUrl(producto.getImagenUrl())
                .build();
    }

    /**
     * Convierte el DTO a una entidad Producto
     */
    public Producto toEntity() {
        return Producto.builder()
                .id(this.id)
                .codigo(this.codigo)
                .nombre(this.nombre)
                .tipo(this.tipo)
                .precioBase(this.precioBase)
                .precioFinal(this.precioFinal)
                .informacionAdicional(this.informacionAdicional)
                .descuentoTotal(this.descuentoTotal)
                .imagenUrl(this.imagenUrl)
                .build();
    }
}
