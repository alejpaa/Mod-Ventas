package com.venta.backend.vendedor.infraestructura.repository;

import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.enums.BranchType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SedeRepositorio extends JpaRepository<Sede, Long> {

    /**
     * Busca todas las sedes que están activas.
     * @return Una lista de entidades Sede activas.
     */
    List<Sede> findByActive(boolean active);

    /**
     * Busca todas las sedes de un tipo específico.
     * (Podría ser útil para filtros)
     * @param branchType El tipo de sede (MODULE, CALL_CENTER, etc.)
     * @return Una lista de entidades Sede de ese tipo.
     */
    List<Sede> findByBranchType(BranchType branchType);
}