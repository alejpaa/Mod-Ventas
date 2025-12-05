package com.venta.backend.vendedor.application.impl;

import com.venta.backend.vendedor.application.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.application.estrategias.IEdicionVendedorStrategia;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;
import org.springframework.stereotype.Service;

@Service
public class EdicionInternaStrategiaImpl implements IEdicionVendedorStrategia {

    @Override
    public void applyChanges(Vendedor sellerToUpdate, ModificacionVendedorRequest request, Sede newBranch) {

        if (newBranch != null) {
            sellerToUpdate.assignBranch(newBranch);
        }

        if (request.getSellerStatus() != null) {
            sellerToUpdate.changeStatus(request.getSellerStatus());
        }
    }
}