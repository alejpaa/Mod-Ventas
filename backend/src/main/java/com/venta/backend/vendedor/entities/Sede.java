package com.venta.backend.vendedor.entities;

import com.venta.backend.vendedor.enums.BranchType;
import jakarta.persistence.*;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "sedes")
public class Sede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private BranchType branchType;

    private Integer maxCapacity;

    @Column(name = "status")
    private boolean active;

    @Column(name = "warehouse_ref_id")
    private Long warehouseRefId; // ID del almacén en el módulo de Inventario
}