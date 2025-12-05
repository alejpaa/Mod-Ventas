package com.venta.backend.vendedor.application.fabricas;

import com.venta.backend.vendedor.application.estrategias.IEdicionVendedorStrategy;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategy;
import com.venta.backend.vendedor.enums.SellerType;

public interface IStrategyFactory {

    /**
     * Obtiene la estrategia de REGISTRO adecuada (Interna o Externa).
     *
     * @param sellerType El tipo de vendedor (INTERNAL o EXTERNAL).
     * @return La implementación de IRegistroVendedorStrategia correspondiente.
     */
    IRegistroVendedorStrategy getRegistrationStrategy(SellerType sellerType);

    /**
     * Obtiene la estrategia de EDICIÓN adecuada (Interna o Externa).
     *
     * @param sellerType El tipo de vendedor (INTERNAL o EXTERNAL).
     * @return La implementación de IEdicionVendedorStrategia correspondiente.
     */
    IEdicionVendedorStrategy getEditionStrategy(SellerType sellerType);
}
