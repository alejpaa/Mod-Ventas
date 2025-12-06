package com.venta.backend.descuento.DTO;

import com.venta.backend.descuento.dominio.enums.TipoDescuento;
import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CrearCuponLoteRequest {
    
    // --- NUEVOS CAMPOS DE LA CAMPAÑA ---
    @NotBlank(message = "El nombre de la campaña es obligatorio.")
    private String nombreCampana; // Prefijo del código del cupón (ej: NAVIDAD25)
    
    @NotNull
    @Min(value = 1, message = "La cantidad a crear debe ser al menos 1.")
    private Integer cantidadCupones; // Cuántos cupones crear (ej: 100)

    // --- CAMPOS COMUNES DEL CUPÓN (para el lote) ---
    @NotNull
    private TipoDescuento tipoDescuento;
    
    @NotNull
    @Min(value = 0, message = "El valor no puede ser negativo.")
    private BigDecimal valor;
    
    @NotNull(message = "La fecha de expiración es obligatoria.")
    private LocalDate fechaExpiracion;
    
    // Estos campos serán forzados en el servicio
    // private Integer usosMaximos; // Forzado a 1 por la lógica anterior
    // private BigDecimal montoMinimoRequerido; // Se puede mantener si se desea
    private BigDecimal montoMinimoRequerido = BigDecimal.ZERO; 
}