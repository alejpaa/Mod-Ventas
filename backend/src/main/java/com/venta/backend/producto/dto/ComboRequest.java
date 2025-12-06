package com.venta.backend.producto.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class ComboRequest {
    private String nombre;
    private List<UUID> productosIds;
}