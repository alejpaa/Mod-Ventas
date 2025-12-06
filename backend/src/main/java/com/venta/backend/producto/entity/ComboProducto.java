package com.venta.backend.producto.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "combo_productos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ComboProducto.ComboProductoId.class)
public class ComboProducto {

    @Id
    @Column(name = "combo_id")
    private Long comboId;

    @Id
    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "orden")
    private Integer orden;

    @Column(name = "precio_individual", precision = 10, scale = 2)
    private BigDecimal precioIndividual;

    @Column(name = "descuento_aplicado", precision = 10, scale = 2)
    private BigDecimal descuentoAplicado;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", insertable = false, updatable = false)
    private Producto combo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", insertable = false, updatable = false)
    private Producto producto;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (descuentoAplicado == null) {
            descuentoAplicado = BigDecimal.ZERO;
        }
    }

    // Clase interna para la clave primaria compuesta
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComboProductoId implements Serializable {
        private Long comboId;
        private Long productoId;
    }
}

