package com.venta.backend.producto.dto;

import java.math.BigDecimal;

import com.venta.backend.producto.entity.Producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para productos disponibles en el frontend
 * Formato esperado por el frontend: { id, codigo, nombre, tipo, precioBase,
 * precioFinal, stock, imagenUrl }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDisponibleDTO {

    private Long id;
    private String codigo;
    private String nombre;
    private String tipo;
    private BigDecimal precioBase;
    private BigDecimal precioFinal;
    private Integer stock;
    private String imagenUrl;

    /**
     * Convierte una entidad Producto a ProductoDisponibleDTO
     */
    public static ProductoDisponibleDTO fromEntity(Producto producto) {
        return ProductoDisponibleDTO.builder()
                .id(producto.getId())
                .codigo(producto.getCodigo())
                .nombre(producto.getNombre())
                .tipo(producto.getTipo().name())
                .precioBase(producto.getPrecioBase())
                .precioFinal(producto.getPrecioFinal())
                .stock(producto.getStock())
                .imagenUrl(producto.getImagenUrl())
                .build();
    }
}
