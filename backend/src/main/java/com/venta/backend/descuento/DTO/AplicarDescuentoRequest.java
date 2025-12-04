package com.venta.backend.descuento.DTO;

public class AplicarDescuentoRequest {
    // Campos necesarios para aplicar el descuento
    private String ventaId; // ID de la venta actual
    private String dniCliente; // DNI del cliente para obtener el tipo de fidelidad
    private String codigoCupon; // Código si el cliente ingresó un cupón
    
    // -----------------------------------------------------
    // 1. Constructor sin argumentos (Requerido por Spring/JSON Deserialización)
    // -----------------------------------------------------
    public AplicarDescuentoRequest() {
        // Constructor vacío
    }

    // -----------------------------------------------------
    // 2. Constructor con todos los argumentos (Opcional, pero útil)
    // -----------------------------------------------------
    public AplicarDescuentoRequest(String ventaId, String dniCliente, String codigoCupon) {
        this.ventaId = ventaId;
        this.dniCliente = dniCliente;
        this.codigoCupon = codigoCupon;
    }

    // -----------------------------------------------------
    // 3. Getters (Métodos de Acceso para leer los valores)
    // -----------------------------------------------------
    public String getVentaId() {
        return ventaId;
    }

    public String getDniCliente() {
        return dniCliente;
    }

    public String getCodigoCupon() {
        return codigoCupon;
    }

    // -----------------------------------------------------
    // 4. Setters (Métodos de Modificación para establecer los valores)
    // -----------------------------------------------------
    public void setVentaId(String ventaId) {
        this.ventaId = ventaId;
    }

    public void setDniCliente(String dniCliente) {
        this.dniCliente = dniCliente;
    }

    public void setCodigoCupon(String codigoCupon) {
        this.codigoCupon = codigoCupon;
    }

    // Opcional: toString() para facilitar la depuración
    @Override
    public String toString() {
        return "AplicarDescuentoRequest{" +
                "ventaId='" + ventaId + '\'' +
                ", dniCliente='" + dniCliente + '\'' +
                ", codigoCupon='" + codigoCupon + '\'' +
                '}';
    }
}