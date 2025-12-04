package com.venta.backend.vendedor.infraestructura.repository;

import com.venta.backend.vendedor.entities.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendedorRepositorio extends JpaRepository<Vendedor, Long>, JpaSpecificationExecutor<Vendedor> {

    /**
     * Busca un vendedor por su DNI.
     * @param dni El DNI a buscar.
     * @return Un Optional que puede contener al Vendedor si se encuentra.
     */
    Optional<Vendedor> findByDni(String dni);

    /**
     * Verifica si ya existe un vendedor con un DNI específico.
     * @param dni El DNI a verificar.
     * @return true si el DNI ya existe, false de lo contrario.
     */
    boolean existsByDni(String dni);

    /**
     * Verifica si ya existe un vendedor con un email específico.
     * (Validación extra, buena práctica)
     * @param email El email a verificar.
     * @return true si el email ya existe, false de lo contrario.
     */
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(v) FROM Vendedor v WHERE v.sellerBranch.branchId = :branchId AND v.sellerStatus = 'ACTIVE'")
    Long countActiveSellersByBranch(@Param("branchId") Long branchId);

}