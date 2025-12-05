package com.venta.backend.descuento.DTO;

import com.venta.backend.descuento.dominio.enums.TipoDescuento;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CrearCuponRequest {
    private String codigo;
    private TipoDescuento tipoDescuento;
    private BigDecimal valor;
    private LocalDate fechaExpiracion;
    private Integer usosMaximos;
    private BigDecimal montoMinimoRequerido;
}