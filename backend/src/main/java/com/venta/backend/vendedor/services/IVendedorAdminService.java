package com.venta.backend.vendedor.services;

import com.venta.backend.vendedor.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.dto.response.VendedorResponse;

public interface IVendedorAdminService {

    /**
     * Registra un nuevo vendedor en el sistema (Interno o Externo).
     *
     * @param request El DTO con toda la información del formulario de registro.
     * @return Un VendedorResponse con los datos del vendedor creado.
     */
    VendedorResponse createSeller(RegistroVendedorRequest request);

    /**
     * Modifica la información de un vendedor existente.
     *
     * @param sellerId El ID del vendedor a modificar.
     * @param request El DTO con los campos que se pueden modificar.
     * @return Un VendedorResponse con los datos actualizados.
     */
    VendedorResponse updateSeller(Long sellerId, ModificacionVendedorRequest request);

    /**
     * Realiza la baja lógica (desactivación) de un vendedor.
     *
     * @param sellerId El ID del vendedor a desactivar.
     */
    void deactivateSeller(Long sellerId);

    /**
     * Reactiva un vendedor que estaba INACTIVE.
     *
     * @param sellerId El ID del vendedor a reactivar.
     * @return Un VendedorResponse con el estado actualizado a ACTIVE.
     */
    VendedorResponse reactivateSeller(Long sellerId);

}
