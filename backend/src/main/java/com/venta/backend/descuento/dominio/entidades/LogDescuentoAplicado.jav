package com.venta.backend.descuento.dominio.entidades;

import com.venta.backend.venta.entities.Venta;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "log_descuento_aplicado")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogDescuentoAplicado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación Bidireccional @OneToOne con Venta (El lado dueño es Venta)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false, unique = true)
    private Venta venta;

    // Campo que almacena el identificador de la regla (MONTO_MINIMO, CLIENTE_PLATINO, CUPON)
    @Column(name = "tipo_regla_aplicada", length = 50, nullable = false)
    private String tipoReglaAplicada;

    // Si fue un cupón (ReglaCupon), se almacena el código para referencia
    @Column(name = "codigo_cupon_aplicado", length = 50)
    private String codigoCuponAplicado;

    // Monto final aplicado
    @Column(name = "monto_descontado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoDescontado;

    // Mensaje descriptivo de la aplicación (Ej: "S/ 50.00 por exceder...")
    @Column(name = "descripcion_aplicada", nullable = false)
    private String descripcionAplicada;

    public static LogDescuentoAplicado fromResponse(
            Venta venta, 
            String tipoRegla, 
            BigDecimal monto, 
            String descripcion, 
            String codigoCupon
    ) {
        return LogDescuentoAplicado.builder()
                .venta(venta)
                .tipoReglaAplicada(tipoRegla)
                .montoDescontado(monto)
                .descripcionAplicada(descripcion)
                // Usamos el código de cupón solo si no es la regla de "NINGUNO"
                .codigoCuponAplicado("NINGUNO".equals(tipoRegla) ? null : codigoCupon)
                .build();
    }
}