package com.venta.backend.vendedor.application.estrategias;

import com.venta.backend.vendedor.application.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;

public interface IEdicionVendedorStrategia {

    /**
     * Aplica los cambios permitidos del DTO a la entidad Vendedor.
     * La externa cambiará Sede, Estado, Apellido, email, etc.)
     *
     * @param sellerToUpdate La entidad Vendedor existente a modificar.
     * @param request El DTO con los datos de la modificación.
     * @param newBranch La entidad Sede (ya buscada por el servicio) a asignar.
     */
    void applyChanges(Vendedor sellerToUpdate, ModificacionVendedorRequest request, Sede newBranch);
}
