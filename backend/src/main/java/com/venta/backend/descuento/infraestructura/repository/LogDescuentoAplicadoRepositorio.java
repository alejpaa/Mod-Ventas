package com.venta.backend.descuento.infraestructura.repository;

import com.venta.backend.descuento.dominio.entidades.LogDescuentoAplicado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogDescuentoAplicadoRepositorio extends JpaRepository<LogDescuentoAplicado, Long> {
    // Métodos de consulta personalizados irían aquí si fueran necesarios.
}