package com.venta.backend.venta.infraestructura.repository;

import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VentaRepositorio extends JpaRepository<Venta, Long> {

    Optional<Venta> findFirstByOrigenVentaOrderByIdDesc(OrigenVenta origenVenta);
}

