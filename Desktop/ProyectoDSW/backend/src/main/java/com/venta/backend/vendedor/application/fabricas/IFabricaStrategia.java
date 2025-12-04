package com.venta.backend.vendedor.application.fabricas;

import com.venta.backend.vendedor.application.estrategias.IEdicionVendedorStrategia;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategia;
import com.venta.backend.vendedor.enums.SellerType;

public interface IFabricaStrategia {

    /**
     * Obtiene la estrategia de REGISTRO adecuada (Interna o Externa).
     *
     * @param sellerType El tipo de vendedor (INTERNAL o EXTERNAL).
     * @return La implementación de IRegistroVendedorStrategia correspondiente.
     */
    IRegistroVendedorStrategia getRegistrationStrategy(SellerType sellerType);

    /**
     * Obtiene la estrategia de EDICIÓN adecuada (Interna o Externa).
     *
     * @param sellerType El tipo de vendedor (INTERNAL o EXTERNAL).
     * @return La implementación de IEdicionVendedorStrategia correspondiente.
     */
    IEdicionVendedorStrategia getEditionStrategy(SellerType sellerType);
}
