package com.venta.backend.vendedor.application.impl;

import com.venta.backend.vendedor.application.estrategias.IEdicionVendedorStrategia;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategia;
import com.venta.backend.vendedor.application.fabricas.IFabricaStrategia;
import com.venta.backend.vendedor.enums.SellerType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class FabricaStrategiaImpl implements IFabricaStrategia {

    // Mapas privados para almacenar las estrategias.
    // Usamos EnumMap porque es la implementación más eficiente para llaves Enum.
    private final Map<SellerType, IRegistroVendedorStrategia> registrationStrategies;
    private final Map<SellerType, IEdicionVendedorStrategia> editionStrategies;

    /**
     * Constructor de la Fábrica.
     * @param internoRegistroImpl   Implementación de registro interno.
     * @param externoRegistroImpl   Implementación de registro externo.
     * @param internoEdicionImpl    Implementación de edición interna.
     * @param externoEdicionImpl    Implementación de edición externa.
     */
    public FabricaStrategiaImpl(
            // Spring busca los Beans que coinciden con estos tipos
            RegistroInternoStrategiaImpl internoRegistroImpl,
            RegistroExternoStrategiaImpl externoRegistroImpl,
            EdicionInternaStrategiaImpl internoEdicionImpl,
            EdicionExternaStrategiaImpl externoEdicionImpl
    ) {
        // 1. Inicializa los mapas
        registrationStrategies = new EnumMap<>(SellerType.class);
        editionStrategies = new EnumMap<>(SellerType.class);

        // 2. Llena el mapa de estrategias de registro
        registrationStrategies.put(SellerType.INTERNAL, internoRegistroImpl);
        registrationStrategies.put(SellerType.EXTERNAL, externoRegistroImpl);

        // 3. Llena el mapa de estrategias de edición
        editionStrategies.put(SellerType.INTERNAL, internoEdicionImpl);
        editionStrategies.put(SellerType.EXTERNAL, externoEdicionImpl);
    }

    @Override
    public IRegistroVendedorStrategia getRegistrationStrategy(SellerType sellerType) {
        IRegistroVendedorStrategia strategy = registrationStrategies.get(sellerType);

        if (strategy == null) {
            throw new IllegalArgumentException("No se encontró estrategia de registro para el tipo: " + sellerType);
        }
        return strategy;
    }

    @Override
    public IEdicionVendedorStrategia getEditionStrategy(SellerType sellerType) {
        IEdicionVendedorStrategia strategy = editionStrategies.get(sellerType);

        if (strategy == null) {
            throw new IllegalArgumentException("No se encontró estrategia de edición para el tipo: " + sellerType);
        }
        return strategy;
    }
}
