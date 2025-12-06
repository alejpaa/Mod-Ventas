package com.venta.backend.cotizacion.model;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.vendedor.entities.Vendedor;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Cotizacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "num_cotizacion", unique = true, nullable = false, length = 100)
    private String numCotizacion;

    @Column(name = "fecha_cotizacion", nullable = false)
    private LocalDate fechaCotizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CotizacionEstado estado;

    @Column(name = "validez_dias")
    private Integer validezDias;

    @Column(name = "total_cotizado", precision = 10, scale = 2)
    private BigDecimal totalCotizado;

    @Column(name = "origen_cotizacion", length = 100)
    private String origenCotizacion;

    @OneToMany(mappedBy = "cotizacion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DetalleCotizacion> items = new ArrayList<>();

    public void addItem(DetalleCotizacion item) {
        item.setCotizacion(this);
        items.add(item);
    }

    public void clearItems() {
        items.forEach(item -> item.setCotizacion(null));
        items.clear();
    }

    /**
     * Calcula la fecha de expiración basada en la fecha de cotización y los días de validez.
     * @return Fecha de expiración de la cotización
     */
    public LocalDate getFechaExpiracion() {
        if (fechaCotizacion == null || validezDias == null) {
            return null;
        }
        return fechaCotizacion.plusDays(validezDias);
    }
}

