package com.venta.backend.cotizacion.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Column(name = "idCliente", nullable = false)
    private Double idCliente;

    @Column(name = "sellerCode", nullable = false, length = 50)
    private String sellerCode;

    @Column(name = "idSede", nullable = false)
    private Integer idSede;

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
}

