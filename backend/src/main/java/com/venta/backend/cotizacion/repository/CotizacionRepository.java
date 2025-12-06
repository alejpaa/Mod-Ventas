package com.venta.backend.cotizacion.repository;

import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.CotizacionEstado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CotizacionRepository extends JpaRepository<Cotizacion, Integer> {

    Optional<Cotizacion> findByNumCotizacion(String numCotizacion);

    /**
     * Lista todas las cotizaciones con paginación y carga eager de cliente y vendedor.
     * Usa EntityGraph en lugar de JOIN FETCH para evitar problemas con paginación.
     */
    @EntityGraph(attributePaths = {"cliente", "vendedor"})
    Page<Cotizacion> findAllBy(Pageable pageable);

    /**
     * Filtra cotizaciones por vendedor con paginación.
     */
    @EntityGraph(attributePaths = {"cliente", "vendedor"})
    Page<Cotizacion> findByVendedor_SellerId(@Param("sellerId") Long sellerId, Pageable pageable);

    /**
     * Cuenta el número de cotizaciones de un vendedor en estados específicos.
     */
    long countByVendedor_SellerIdAndEstadoIn(Long vendedorId, List<CotizacionEstado> estados);
}
