package com.venta.backend.venta.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ItemProducto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item_producto")
    private Long id;

    @Column(name = "tipo_item")
    private String tipoItem;

    private String nombre;
    private String descripcion;

    @Column(name = "precio_base", nullable = false)
    private BigDecimal precioBase;

    private String estado;

    @Column(name = "img_referencia")
    private String imgReferencia;
}

