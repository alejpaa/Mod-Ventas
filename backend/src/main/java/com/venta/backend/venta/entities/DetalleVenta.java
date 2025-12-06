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

    @Column(name = "id_producto", nullable = false)
    private Long idProducto;
    
    @Column(name = "nombre_producto", nullable = false)
    private String nombreProducto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;

    @Column(name = "descuento_monto", nullable = false)
    private BigDecimal descuentoMonto;

    @Column(nullable = false)
    private BigDecimal subtotal;

    public static DetalleVenta nuevoDetalle(Venta venta, Long idProducto, String nombreProducto, BigDecimal precioUnitario, int cantidad) {
        BigDecimal subtotalCalculado = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        return DetalleVenta.builder()
                .venta(venta)
                .idProducto(idProducto)
                .nombreProducto(nombreProducto)
                .cantidad(cantidad)
                .precioUnitario(precioUnitario)
                .descuentoMonto(BigDecimal.ZERO)
                .subtotal(subtotalCalculado)
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

