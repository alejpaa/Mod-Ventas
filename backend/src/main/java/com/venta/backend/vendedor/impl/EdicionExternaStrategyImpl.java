package com.venta.backend.vendedor.impl;

import com.venta.backend.vendedor.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.strategies.IEdicionVendedorStrategy;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;
import org.springframework.stereotype.Service;

@Service
public class EdicionExternaStrategyImpl implements IEdicionVendedorStrategy {

    @Override
    public void applyChanges(Vendedor sellerToUpdate, ModificacionVendedorRequest request, Sede newBranch) {

        // Si el DTO trae un nuevo valor, lo actualiza. Si no (es null), deja el que ya tenía.
        if (request.getLastName() != null) {
            sellerToUpdate.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            sellerToUpdate.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            sellerToUpdate.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            sellerToUpdate.setAddress(request.getAddress());
        }

        if (request.getBankAccount() != null) {
            sellerToUpdate.setBankAccount(request.getBankAccount());
        }

        if (request.getBankName() != null) {
            sellerToUpdate.setBankName(request.getBankName());
        }

        if (newBranch != null) {
            sellerToUpdate.assignBranch(newBranch);
        }

        if (request.getSellerStatus() != null) {
            sellerToUpdate.changeStatus(request.getSellerStatus());
        }
    }
}
