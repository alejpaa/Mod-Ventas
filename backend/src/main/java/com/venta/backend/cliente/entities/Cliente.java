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

    @Column(nullable = false, updatable = false)
    private LocalDate registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoClienteEnum estado;

    private String categoria; // Estándar, VIP, etc.

    /**
     * Comprueba si el cliente está activo.
     * @return true si el estado es ACTIVO, false de lo contrario.
     */
    public boolean isActive() {
        return this.estado == EstadoClienteEnum.ACTIVO;
    }

    /**
     * Cambia el estado del cliente (para baja lógica o reactivación).
     * @param newEstado El nuevo estado (ACTIVO, INACTIVO, BLOQUEADO).
     */
    public void changeStatus(EstadoClienteEnum newEstado) {
        this.estado = newEstado;
    }

    /**
     * Devuelve el nombre completo del cliente.
     * @return String con "firstName lastName".
     */
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    /**
     * Actualiza la categoría del cliente según su historial de compras.
     * @param nuevaCategoria La nueva categoría (Estándar, VIP, etc.).
     */
    public void updateCategoria(String nuevaCategoria) {
        this.categoria = nuevaCategoria;
    }

    public String getTipoFidelidad() {
        return this.categoria;
    }
}

