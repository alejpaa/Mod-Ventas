package com.venta.backend.descuento.DTO;

import com.venta.backend.descuento.dominio.enums.TipoDescuento;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CuponResponse {
    private Long id;
    private String codigo;
    private TipoDescuento tipoDescuento;
    private BigDecimal valor;
    private LocalDate fechaExpiracion;
    private Integer usosMaximos;
    private Integer usosActuales;
    private BigDecimal montoMinimoRequerido;
    private String estado; // Calculado (ACTIVO, EXPIRADO, AGOTADO)
}