package com.venta.backend.venta.infraestructura.repository;

import com.venta.backend.venta.entities.VentaLead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaLeadRepositorio extends JpaRepository<VentaLead, Long> {
}
