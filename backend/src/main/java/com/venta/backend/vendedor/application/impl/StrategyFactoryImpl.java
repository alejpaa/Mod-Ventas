package com.venta.backend.vendedor.application.impl;

import com.venta.backend.vendedor.application.estrategias.IEdicionVendedorStrategy;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategy;
import com.venta.backend.vendedor.application.fabricas.IStrategyFactory;
import com.venta.backend.vendedor.enums.SellerType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class StrategyFactoryImpl implements IStrategyFactory {

    // Mapas privados para almacenar las estrategias.
    // Usamos EnumMap porque es la implementación más eficiente para llaves Enum.
    private final Map<SellerType, IRegistroVendedorStrategy> registrationStrategies;
    private final Map<SellerType, IEdicionVendedorStrategy> editionStrategies;

    /**
     * Constructor de la Fábrica.
     * @param internoRegistroImpl   Implementación de registro interno.
     * @param externoRegistroImpl   Implementación de registro externo.
     * @param internoEdicionImpl    Implementación de edición interna.
     * @param externoEdicionImpl    Implementación de edición externa.
     */
    public StrategyFactoryImpl(
            // Spring busca los Beans que coinciden con estos tipos
            RegistroInternoStrategyImpl internoRegistroImpl,
            RegistroExternoStrategyImpl externoRegistroImpl,
            EdicionInternaStrategyImpl internoEdicionImpl,
            EdicionExternaStrategyImpl externoEdicionImpl
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
    public IRegistroVendedorStrategy getRegistrationStrategy(SellerType sellerType) {
        IRegistroVendedorStrategy strategy = registrationStrategies.get(sellerType);

        if (strategy == null) {
            throw new IllegalArgumentException("No se encontró estrategia de registro para el tipo: " + sellerType);
        }
        return strategy;
    }

    @Override
    public IEdicionVendedorStrategy getEditionStrategy(SellerType sellerType) {
        IEdicionVendedorStrategy strategy = editionStrategies.get(sellerType);

        if (strategy == null) {
            throw new IllegalArgumentException("No se encontró estrategia de edición para el tipo: " + sellerType);
        }
        return strategy;
    }
}
