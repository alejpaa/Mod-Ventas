package com.venta.backend.venta.factory;

import com.venta.backend.venta.enums.OrigenVenta;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class VentaFactoryResolver {

    private final Map<OrigenVenta, VentaFactory> factories = new EnumMap<>(OrigenVenta.class);

    public VentaFactoryResolver(List<VentaFactory> availableFactories) {
        availableFactories.forEach(factory -> factories.put(factory.origenSoportado(), factory));
    }

    public VentaFactory getFactory(OrigenVenta origen) {
        if (!factories.containsKey(origen)) {
            throw new IllegalArgumentException("Origen de venta no soportado: " + origen);
        }
        return factories.get(origen);
    }
}

