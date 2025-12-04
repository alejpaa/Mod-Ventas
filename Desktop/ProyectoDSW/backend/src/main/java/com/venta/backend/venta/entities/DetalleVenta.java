package com.venta.backend.venta.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "DetalleVenta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_venta")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta venta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_item_producto", nullable = false)
    private ItemProducto itemProducto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;

    @Column(name = "descuento_monto", nullable = false)
    private BigDecimal descuentoMonto;

    @Column(nullable = false)
    private BigDecimal subtotal;

    public static DetalleVenta nuevoDetalle(Venta venta, ItemProducto item, int cantidad) {
        return DetalleVenta.builder()
                .venta(venta)
                .itemProducto(item)
                .cantidad(cantidad)
                .precioUnitario(item.getPrecioBase())
                .descuentoMonto(BigDecimal.ZERO)
                .subtotal(item.getPrecioBase().multiply(BigDecimal.valueOf(cantidad)))
                .build();
    }

    public void incrementarCantidad(int delta) {
        this.cantidad += delta;
        recalcularSubtotal();
    }

    public void actualizarCantidad(int nuevaCantidad) {
        this.cantidad = nuevaCantidad;
        recalcularSubtotal();
    }

    private void recalcularSubtotal() {
        BigDecimal total = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        this.subtotal = total.subtract(descuentoMonto);
    }
}

