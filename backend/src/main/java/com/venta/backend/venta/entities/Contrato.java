package com.venta.backend.venta.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entidad que representa un contrato asociado a una venta.
 * Contiene información de duración, facturación y estado del contrato.
 */
@Entity
@Table(name = "contrato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contrato")
    private Long idContrato;

    @Column(name = "num_contrato", unique = true, nullable = false, length = 50)
    private String numContrato;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta venta;

    @Column(name = "cliente_id", nullable = false)
    private Long clienteId;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "duracion_meses")
    private Integer duracionMeses;

    @Column(name = "dia_facturacion")
    private Integer diaFacturacion;

    @Column(name = "ciclo_facturacion", length = 50)
    private String cicloFacturacion;

    @Column(name = "monto_mensual", precision = 10, scale = 2)
    private BigDecimal montoMensual;

    @Column(name = "moneda", length = 10)
    private String moneda;

    @Column(name = "estado", length = 50, nullable = false)
    private String estado;
}
