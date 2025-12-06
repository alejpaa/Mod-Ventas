package com.venta.backend.venta.repository;

import com.venta.backend.venta.entities.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentaRepositorio extends JpaRepository<DetalleVenta, Long> {
    
    List<DetalleVenta> findByVentaId(Long ventaId);
}
