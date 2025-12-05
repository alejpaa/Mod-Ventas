package com.venta.backend.vendedor.entities;

import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.enums.SellerType;
import com.venta.backend.vendedor.enums.DocumentType;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vendedores")
public class Vendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    @Column(nullable = false, unique = true, length = 8)
    private String dni;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(length = 15) // Buena práctica poner longitud
    private String phoneNumber;

    private String address;

    @Column(nullable = false, updatable = false) // Se asigna al crear y no se actualiza
    private LocalDate registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SellerType sellerType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SellerStatus sellerStatus;


    @Column(name = "employee_rrhh_id", unique = true)
    private Long employeeRrhhId; // ID del trabajador en el módulo de RRHH

    // Para vendedores EXTERNOS que tienen RUC
    @Column(length = 11, unique = true)
    private String ruc; // Solo para vendedores externos con factura

    // Información bancaria para pagos de comisiones
    @Column(length = 20)
    private String bankAccount; // Cuenta bancaria

    @Column(length = 50)
    private String bankName; // Nombre del banco

    @Enumerated(EnumType.STRING)
    @Column(name = "id_document_type")
    private DocumentType documentType; // DNI, CE, PASAPORTE

    /*
    * significa que la información de la sede (Sede)
    * solo se carga de la base de datos cuando realmente
    * se necesita (acceso diferido), optimizando el rendimiento.
    * */
    @ManyToOne(fetch = FetchType.LAZY) // Relación: Muchos Vendedores van a una Sede
    @JoinColumn(name = "id_sede", nullable = false)
    private Sede sellerBranch;

    /**
     * Comprueba si el vendedor está activo.
     * @return true si el estado es ACTIVE, false de lo contrario.
     */
    public boolean isActive() {
        return this.sellerStatus == SellerStatus.ACTIVE;
    }

    /**
     * Cambia el estado del vendedor (para baja lógica o reactivación).
     * @param newStatus El nuevo estado (ACTIVE o INACTIVE).
     */
    public void changeStatus(SellerStatus newStatus) {
        this.sellerStatus = newStatus;
    }

    /**
     * Asigna o reasigna al vendedor a una nueva sede.
     * @param newBranch La nueva entidad Sede.
     */
    public void assignBranch(Sede newBranch) {
        this.sellerBranch = newBranch;
    }

    /**
     * Devuelve el nombre completo del vendedor.
     * @return String con "firstName lastName".
     */
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }
}