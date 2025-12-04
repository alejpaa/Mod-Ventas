package com.venta.backend.cliente.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "preferencia")
public class Preferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_preferencia")
    private Long idPreferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "idioma", length = 50)
    private String idioma;

    @Column(name = "canal_contacto_favorito", length = 50)
    private String canalContactoFavorito;

    @Column(name = "intereses_declarados", columnDefinition = "TEXT")
    private String interesesDeclarados;

    @Column(name = "acepta_publicidad", nullable = false)
    private Boolean aceptaPublicidad;

    // Constructor vacío
    public Preferencia() {
    }

    // Constructor con parámetros
    public Preferencia(Cliente cliente, String idioma, String canalContactoFavorito,
                       String interesesDeclarados, Boolean aceptaPublicidad) {
        this.cliente = cliente;
        this.idioma = idioma;
        this.canalContactoFavorito = canalContactoFavorito;
        this.interesesDeclarados = interesesDeclarados;
        this.aceptaPublicidad = aceptaPublicidad;
    }

    // Getters y Setters
    public Long getIdPreferencia() {
        return idPreferencia;
    }

    public void setIdPreferencia(Long idPreferencia) {
        this.idPreferencia = idPreferencia;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public String getCanalContactoFavorito() {
        return canalContactoFavorito;
    }

    public void setCanalContactoFavorito(String canalContactoFavorito) {
        this.canalContactoFavorito = canalContactoFavorito;
    }

    public String getInteresesDeclarados() {
        return interesesDeclarados;
    }

    public void setInteresesDeclarados(String interesesDeclarados) {
        this.interesesDeclarados = interesesDeclarados;
    }

    public Boolean getAceptaPublicidad() {
        return aceptaPublicidad;
    }

    public void setAceptaPublicidad(Boolean aceptaPublicidad) {
        this.aceptaPublicidad = aceptaPublicidad;
    }

    @Override
    public String toString() {
        return "Preferencia{" +
                "idPreferencia=" + idPreferencia +
                ", idioma='" + idioma + '\'' +
                ", canalContactoFavorito='" + canalContactoFavorito + '\'' +
                ", interesesDeclarados='" + interesesDeclarados + '\'' +
                ", aceptaPublicidad=" + aceptaPublicidad +
                '}';
    }
}