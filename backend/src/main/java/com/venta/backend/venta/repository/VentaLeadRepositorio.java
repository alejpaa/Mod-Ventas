package com.venta.backend.venta.repository;

import com.venta.backend.venta.entities.VentaLead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VentaLeadRepositorio extends JpaRepository<VentaLead, Long> {
    Optional<VentaLead> findByIdVenta(Long idVenta);
}
