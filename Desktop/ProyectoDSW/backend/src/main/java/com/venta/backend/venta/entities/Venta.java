package com.venta.backend.venta.entities;

import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Long id;

    @Column(name = "num_venta")
    private String numVenta;

    @Enumerated(EnumType.STRING)
    @Column(name = "origen_venta", nullable = false)
    private OrigenVenta origenVenta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VentaEstado estado;

    @Column(name = "fecha_venta_creada")
    private LocalDate fechaVentaCreada;

    @Column(name = "fecha_venta_completada")
    private LocalDate fechaVentaCompletada;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(name = "descuento_total", nullable = false)
    private BigDecimal descuentoTotal;

    @Column(nullable = false)
    private BigDecimal total;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleVenta> detalles = new ArrayList<>();

    public boolean esBorrador() {
        return VentaEstado.BORRADOR.equals(estado);
    }

    public void agregarOActualizarItem(ItemProducto producto, int cantidad) {
        DetalleVenta existente = detalles.stream()
                .filter(det -> det.getItemProducto().getId().equals(producto.getId()))
                .findFirst()
                .orElse(null);

        if (existente == null) {
            DetalleVenta nuevo = DetalleVenta.nuevoDetalle(this, producto, cantidad);
            detalles.add(nuevo);
        } else {
            existente.incrementarCantidad(cantidad);
        }

        recalcularMontos();
    }

    public void recalcularMontos() {
        BigDecimal nuevoSubtotal = detalles.stream()
                .map(DetalleVenta::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.subtotal = nuevoSubtotal;
        this.descuentoTotal = BigDecimal.ZERO;
        this.total = nuevoSubtotal;
    }
}

