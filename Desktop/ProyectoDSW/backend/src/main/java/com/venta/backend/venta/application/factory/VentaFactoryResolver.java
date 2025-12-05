package com.venta.backend.venta.application.factory;

import com.venta.backend.venta.enums.OrigenVenta;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class VentaFactoryResolver {

    private final Map<OrigenVenta, IVentaFactory> factories = new EnumMap<>(OrigenVenta.class);

    public VentaFactoryResolver(List<IVentaFactory> availableFactories) {
        availableFactories.forEach(factory -> factories.put(factory.origenSoportado(), factory));
    }

    public IVentaFactory getFactory(OrigenVenta origen) {
        if (!factories.containsKey(origen)) {
            throw new IllegalArgumentException("Origen de venta no soportado: " + origen);
        }
        return factories.get(origen);
    }
}

