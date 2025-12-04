package com.venta.backend.descuento.DTO;

import java.math.BigDecimal;

public class DescuentoAplicadoResponse {
    
    private String tipoDescuento;
    private BigDecimal montoDescontado;
    private BigDecimal nuevoTotalVenta;
    private String mensaje; // Mensaje de éxito o la razón del descuento (Ej: "15% por ser Platino").

    // -----------------------------------------------------
    // 1. Constructor sin argumentos (Requerido para la deserialización de JSON por Spring)
    // -----------------------------------------------------
    public DescuentoAplicadoResponse() {
        // Inicialización por defecto
    }

    // -----------------------------------------------------
    // 2. Constructor con todos los argumentos (Utilizado en el DiscountService para crear la respuesta)
    // -----------------------------------------------------
    public DescuentoAplicadoResponse(String tipoDescuento, BigDecimal montoDescontado, BigDecimal nuevoTotalVenta, String mensaje) {
        this.tipoDescuento = tipoDescuento;
        this.montoDescontado = montoDescontado;
        this.nuevoTotalVenta = nuevoTotalVenta;
        this.mensaje = mensaje;
    }
    
    // -----------------------------------------------------
    // 3. Getters (Métodos de Acceso)
    // -----------------------------------------------------
    public String getTipoDescuento() {
        return tipoDescuento;
    }

    public BigDecimal getMontoDescontado() {
        return montoDescontado;
    }

    public BigDecimal getNuevoTotalVenta() {
        return nuevoTotalVenta;
    }

    public String getMensaje() {
        return mensaje;
    }

    // -----------------------------------------------------
    // 4. Setters (Métodos de Modificación)
    // -----------------------------------------------------
    public void setTipoDescuento(String tipoDescuento) {
        this.tipoDescuento = tipoDescuento;
    }

    public void setMontoDescontado(BigDecimal montoDescontado) {
        this.montoDescontado = montoDescontado;
    }

    public void setNuevoTotalVenta(BigDecimal nuevoTotalVenta) {
        this.nuevoTotalVenta = nuevoTotalVenta;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}