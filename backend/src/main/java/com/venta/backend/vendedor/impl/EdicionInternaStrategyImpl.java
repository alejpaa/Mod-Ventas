package com.venta.backend.vendedor.impl;

import com.venta.backend.vendedor.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.strategies.IEdicionVendedorStrategy;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;
import org.springframework.stereotype.Service;

@Service
public class EdicionInternaStrategyImpl implements IEdicionVendedorStrategy {

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