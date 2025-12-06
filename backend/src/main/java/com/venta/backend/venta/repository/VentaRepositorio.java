package com.venta.backend.venta.repository;

import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VentaRepositorio extends JpaRepository<Venta, Long> {

    Optional<Venta> findFirstByOrigenVentaOrderByIdDesc(OrigenVenta origenVenta);
    
    @Query("SELECT v FROM Venta v WHERE v.origenVenta = :origen AND v.estado = :estado ORDER BY v.fechaVentaCreada DESC")
    List<Venta> findByOrigenVentaAndEstado(OrigenVenta origen, VentaEstado estado);
}

