package com.venta.backend.producto.repository;

import com.venta.backend.producto.entity.Producto;
import com.venta.backend.producto.enums.TipoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Obtiene productos disponibles (activos y con stock) para el frontend
     */
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stock > 0 AND p.tipo <> com.venta.backend.producto.enums.TipoProducto.COMBO ORDER BY p.nombre")
    List<Producto> findProductosDisponibles();

    /**
     * Obtiene todos los productos individuales (no combos)
     */
    @Query("SELECT p FROM Producto p WHERE p.tipo <> com.venta.backend.producto.enums.TipoProducto.COMBO ORDER BY p.nombre")
    List<Producto> findAllProductosIndividuales();

    /**
     * Obtiene todos los combos
     */
    @Query("SELECT p FROM Producto p WHERE p.tipo = com.venta.backend.producto.enums.TipoProducto.COMBO ORDER BY p.nombre")
    List<Producto> findAllCombos();

    /**
     * Busca por código
     */
    Optional<Producto> findByCodigo(String codigo);

    /**
     * Filtra por tipo de producto
     */
    List<Producto> findByTipoAndActivoTrue(TipoProducto tipo);
}

