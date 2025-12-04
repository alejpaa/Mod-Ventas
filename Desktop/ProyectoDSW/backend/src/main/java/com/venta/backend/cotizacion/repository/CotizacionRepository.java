package com.venta.backend.cotizacion.repository;

import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.CotizacionEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CotizacionRepository extends JpaRepository<Cotizacion, Integer> {

    Optional<Cotizacion> findByIdAndEstado(Integer id, CotizacionEstado estado);

    Optional<Cotizacion> findByNumCotizacion(String numCotizacion);
}


