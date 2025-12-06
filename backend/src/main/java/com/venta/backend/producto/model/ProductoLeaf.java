package com.venta.backend.producto.model;

import com.venta.backend.producto.enums.TipoProducto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

// Leaf Component - Producto individual
@Getter
@Setter
@Builder
public class ProductoLeaf implements IProductoComponent {

    private UUID id;
    private String nombre;
    private BigDecimal precioBase;
    private TipoProducto tipo;
    private String informacionAdicional; // e.g., "Costo mensual", "6 meses mínimo"

    // Precio con el descuento aplicado, si es parte de un combo.
    private BigDecimal precioFinal;

    // Se asume que el precio final inicial es el precio base
    @Override
    public BigDecimal getPrecioFinal() {
        return precioFinal != null ? precioFinal : precioBase;
    }
}