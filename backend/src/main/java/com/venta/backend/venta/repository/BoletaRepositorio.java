package com.venta.backend.venta.repository;

import com.venta.backend.venta.entities.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoletaRepositorio extends JpaRepository<Boleta, Long> {
    
    /**
     * Obtiene todas las boletas de un vendedor usando su employee_rrhh_id
     * Hace un INNER JOIN entre Boleta y Vendedor
     */
    @Query("SELECT b FROM Boleta b " +
           "INNER JOIN Vendedor v ON b.idVendedor = v.sellerId " +
           "WHERE v.employeeRrhhId = :employeeRrhhId")
    List<Boleta> findBoletasByEmployeeRrhhId(@Param("employeeRrhhId") Long employeeRrhhId);

    /**
     * Obtiene todas las boletas de un cliente
     * Hace un INNER JOIN entre Boleta y Venta
     */
    @Query("SELECT b FROM Boleta b " +
           "INNER JOIN Venta v ON b.idVenta = v.id " +
           "WHERE v.clienteId = :clienteId")
    List<Boleta> findBoletasByClienteId(@Param("clienteId") Long clienteId);
}
