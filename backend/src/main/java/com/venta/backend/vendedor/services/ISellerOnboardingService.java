package com.venta.backend.vendedor.services;

import com.venta.backend.vendedor.entities.Vendedor;

public interface ISellerOnboardingService {
    /**
     * Inicia el flujo de bienvenida y entrega de materiales al vendedor.
     * @param newSeller La entidad Vendedor recién creada.
     */
    void onboardSeller(Vendedor newSeller);
}
