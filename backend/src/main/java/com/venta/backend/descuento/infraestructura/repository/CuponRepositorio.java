package com.venta.backend.descuento.infraestructura.repository;

import com.venta.backend.descuento.dominio.entidades.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CuponRepositorio extends JpaRepository<Cupon, Long> {

    // Método clave para la validación y uso.
    Optional<Cupon> findByCodigo(String codigo);
}