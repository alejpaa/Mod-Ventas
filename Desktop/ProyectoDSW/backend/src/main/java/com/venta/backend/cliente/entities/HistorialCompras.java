package com.venta.backend.cliente.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_compras")
public class HistorialCompras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idHistorial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "id_venta", nullable = false)
    private Long idVenta;

    @Column(name = "fecha_compra", nullable = false)
    private LocalDateTime fechaCompra;

    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "descuento_aplicado", precision = 10, scale = 2)
    private BigDecimal descuentoAplicado;

    @Column(name = "estado", length = 50)
    private String estado;

    // Constructor vacío
    public HistorialCompras() {
    }

    // Constructor con parámetros
    public HistorialCompras(Cliente cliente, Long idVenta, LocalDateTime fechaCompra,
                            BigDecimal montoTotal, BigDecimal descuentoAplicado, String estado) {
        this.cliente = cliente;
        this.idVenta = idVenta;
        this.fechaCompra = fechaCompra;
        this.montoTotal = montoTotal;
        this.descuentoAplicado = descuentoAplicado;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(Long idHistorial) {
        this.idHistorial = idHistorial;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Long getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(Long idVenta) {
        this.idVenta = idVenta;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(LocalDateTime fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public BigDecimal getDescuentoAplicado() {
        return descuentoAplicado;
    }

    public void setDescuentoAplicado(BigDecimal descuentoAplicado) {
        this.descuentoAplicado = descuentoAplicado;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "HistorialCompras{" +
                "idHistorial=" + idHistorial +
                ", idVenta=" + idVenta +
                ", fechaCompra=" + fechaCompra +
                ", montoTotal=" + montoTotal +
                ", descuentoAplicado=" + descuentoAplicado +
                ", estado='" + estado + '\'' +
                '}';
    }
}