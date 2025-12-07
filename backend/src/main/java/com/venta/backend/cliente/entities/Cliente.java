package com.venta.backend.cliente.entities;

import com.venta.backend.cliente.enums.EstadoClienteEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clienteId;

    @Column(unique = true, length = 8)
    private String dni;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(length = 15)
    private String phoneNumber;

    @Column(length = 15)
    private String telefonoFijo;

    private String address;
    private LocalDate fechaNacimiento;

    @Column(length = 20)
    private String genero;

    @Column(length = 100)
    private String ocupacion;

    @Column(nullable = false, updatable = false)
    private LocalDate registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoClienteEnum estado;

    private String categoria;

    public boolean isActive() {
        return this.estado == EstadoClienteEnum.ACTIVO;
    }

    public void changeStatus(EstadoClienteEnum newEstado) {
        this.estado = newEstado;
    }

    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    public void updateCategoria(String nuevaCategoria) {
        this.categoria = nuevaCategoria;
    }

    public String getTipoFidelidad() {
        return this.categoria;
    }
}