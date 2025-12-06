package com.venta.backend.producto.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request para crear un combo usando IDs tipo Long
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComboDBRequest {
    private String nombre;
    private List<Long> productosIds;
}
