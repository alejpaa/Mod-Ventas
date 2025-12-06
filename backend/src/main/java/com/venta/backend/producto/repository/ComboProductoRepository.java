package com.venta.backend.producto.repository;

import com.venta.backend.producto.entity.ComboProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboProductoRepository extends JpaRepository<ComboProducto, ComboProducto.ComboProductoId> {

    /**
     * Obtiene todos los productos de un combo específico
     */
    @Query("SELECT cp FROM ComboProducto cp WHERE cp.comboId = :comboId ORDER BY cp.orden")
    List<ComboProducto> findByComboId(@Param("comboId") Long comboId);

    /**
     * Obtiene todos los combos que incluyen un producto específico
     */
    List<ComboProducto> findByProductoId(Long productoId);
}

