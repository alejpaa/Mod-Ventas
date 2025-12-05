package com.venta.backend.venta.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entidad que representa una boleta de venta asociada a un vendedor.
 * Registra el monto vendido y la fecha de generación para cálculo de comisiones.
 */
@Entity
@Table(name = "boleta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Long idBoleta;

    @Column(name = "id_vendedor", nullable = false)
    private Long idVendedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta venta;

    @Column(name = "fecha_generacion", nullable = false)
    private LocalDate fechaGeneracion;

    @Column(name = "monto_vendido", precision = 10, scale = 2, nullable = false)
    private BigDecimal montoVendido;
}
