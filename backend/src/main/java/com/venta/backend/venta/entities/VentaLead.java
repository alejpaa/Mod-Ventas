package com.venta.backend.venta.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Entidad que representa información adicional de una venta originada desde un Lead.
 * Contiene datos del canal de origen, campaña de marketing y notas de seguimiento.
 */
@Entity
@Table(name = "venta_lead")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaLead {

    @Id
    @Column(name = "id_venta")
    private Long idVenta;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_venta")
    private Venta venta;

    @Column(name = "canal_origen", length = 100)
    private String canalOrigen;

    @Column(name = "id_campania_marketing")
    private Integer idCampaniaMarketing;

    @Column(name = "nombre_campania", length = 200)
    private String nombreCampania;

    @Column(name = "tematica", length = 200)
    private String tematica;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "notas_llamada", columnDefinition = "TEXT")
    private String notasLlamada;

    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio;
}
