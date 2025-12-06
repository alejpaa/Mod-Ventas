package com.venta.backend.vendedor.strategies;

import com.venta.backend.vendedor.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;

public interface IRegistroVendedorStrategy {

    /**
     * Valida los datos de entrada específicos de esta estrategia.
     * (Ej: la estrategia interna validará que el DNI no esté ya en la BD,
     * la externa validará que todos los campos manuales estén llenos).
     * Además enviará un correo de bienvenida
     * O la interna deberá ser registrados solo en sedes de ventas centrales o
     * Call center
     *
     * @param request El DTO de registro.
     */
    void validateData(RegistroVendedorRequest request, Sede sede);

    /**
     * Crea la entidad Vendedor (sin guardar) basada en la lógica de esta estrategia.
     * (Ej: la estrategia interna llama a IClienteRRHH y copia los datos).
     *
     * @param request El DTO de registro.
     * @return Una entidad Vendedor lista para ser guardada por el servicio.
     */
    Vendedor createSellerEntity(RegistroVendedorRequest request);
}