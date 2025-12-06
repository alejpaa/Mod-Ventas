package com.venta.backend.producto.model;

import com.venta.backend.producto.enums.TipoProducto;
import java.math.BigDecimal;
import java.util.UUID;

// Component Interface
public interface IProductoComponent {
    UUID getId();
    String getNombre();
    BigDecimal getPrecioBase(); // Precio antes de cualquier descuento del combo
    BigDecimal getPrecioFinal(); // Precio con el descuento aplicado (si es parte de un Combo)
    TipoProducto getTipo();
    String getInformacionAdicional();
}