package com.venta.backend.descuento.dominio.entidades;

import com.venta.backend.descuento.dominio.enums.TipoDescuento;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cupones")
@Data
@NoArgsConstructor
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codigo; // Código que el cliente ingresa

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDescuento tipoDescuento; // Define si es % o monto fijo

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor; // El porcentaje o el monto

    private LocalDate fechaExpiracion;

    private Integer usosMaximos; // Usos totales permitidos (null para ilimitado)

    private Integer usosActuales = 0;

    private BigDecimal montoMinimoRequerido = BigDecimal.ZERO; // Requisito de monto

    // Métodos de dominio
    public boolean estaExpirado() {
        return fechaExpiracion != null && fechaExpiracion.isBefore(LocalDate.now());
    }

    public boolean tieneUsosDisponibles() {
        return usosMaximos == null || usosActuales < usosMaximos;
    }

    public void usar() {
        if (tieneUsosDisponibles()) {
            this.usosActuales++;
        }
    }
}