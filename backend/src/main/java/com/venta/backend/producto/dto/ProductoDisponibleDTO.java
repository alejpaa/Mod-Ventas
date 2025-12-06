package com.venta.backend.producto.dto;

import java.math.BigDecimal;

import com.venta.backend.producto.entity.Producto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para productos disponibles en el frontend
 * Formato esperado por el frontend: { id, codigo, nombre, tipo, precio, imagenUrl }
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
    private BigDecimal precio;
    private String imagenUrl;

    /**
     * Convierte una entidad Producto a ProductoDisponibleDTO
     */
    public static ProductoDisponibleDTO fromEntity(Producto producto) {
        // Si precioFinal es 0 o null, usar precioBase
        BigDecimal precioMostrar = (producto.getPrecioFinal() != null && producto.getPrecioFinal().compareTo(BigDecimal.ZERO) > 0)
                ? producto.getPrecioFinal()
                : producto.getPrecioBase();
        
        return ProductoDisponibleDTO.builder()
                .id(producto.getId())
                .codigo(producto.getCodigo())
                .nombre(producto.getNombre())
                .tipo(producto.getTipo().name())
                .precio(precioMostrar)
                .imagenUrl(producto.getImagenUrl())
                .build();
    }
}

