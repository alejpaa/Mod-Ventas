package com.venta.backend.cliente.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "direccion")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long idDireccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "departamento", length = 100)
    private String departamento;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "distrito", length = 100)
    private String distrito;

    @Column(name = "direccion_exacta", columnDefinition = "TEXT")
    private String direccionExacta;

    @Column(name = "referencia", columnDefinition = "TEXT")
    private String referencia;

    @Column(name = "es_principal", nullable = false)
    private Boolean esPrincipal;

    // Constructor vacío
    public Direccion() {
    }

    // Constructor con parámetros
    public Direccion(Cliente cliente, String departamento, String provincia, String distrito,
                     String direccionExacta, String referencia, Boolean esPrincipal) {
        this.cliente = cliente;
        this.departamento = departamento;
        this.provincia = provincia;
        this.distrito = distrito;
        this.direccionExacta = direccionExacta;
        this.referencia = referencia;
        this.esPrincipal = esPrincipal;
    }

    // Getters y Setters
    public Long getIdDireccion() {
        return idDireccion;
    }

    public void setIdDireccion(Long idDireccion) {
        this.idDireccion = idDireccion;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getDistrito() {
        return distrito;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public String getDireccionExacta() {
        return direccionExacta;
    }

    public void setDireccionExacta(String direccionExacta) {
        this.direccionExacta = direccionExacta;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Boolean getEsPrincipal() {
        return esPrincipal;
    }

    public void setEsPrincipal(Boolean esPrincipal) {
        this.esPrincipal = esPrincipal;
    }

    @Override
    public String toString() {
        return "Direccion{" +
                "idDireccion=" + idDireccion +
                ", departamento='" + departamento + '\'' +
                ", provincia='" + provincia + '\'' +
                ", distrito='" + distrito + '\'' +
                ", direccionExacta='" + direccionExacta + '\'' +
                ", referencia='" + referencia + '\'' +
                ", esPrincipal=" + esPrincipal +
                '}';
    }
}