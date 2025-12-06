package com.venta.backend.producto.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.venta.backend.producto.enums.TipoProducto;
import com.venta.backend.producto.model.ComboComposite;
import com.venta.backend.producto.model.IProductoComponent;
import com.venta.backend.producto.model.ProductoLeaf;

@Repository
public class IProductoComponentRepository {
    // Almacenamiento en memoria para simular la BDD
    private final Map<UUID, IProductoComponent> components = new HashMap<>();

    public IProductoComponentRepository() {
        // Simular Productos Individuales
        UUID id1 = UUID.randomUUID();
        components.put(id1, ProductoLeaf.builder().id(id1).nombre("Smartphone X20").precioBase(new BigDecimal("1200.00")).tipo(TipoProducto.EQUIPO_MOVIL).informacionAdicional("Color Azul, 128GB").build());

        UUID id2 = UUID.randomUUID();
        components.put(id2, ProductoLeaf.builder().id(id2).nombre("Internet 100Mbps").precioBase(new BigDecimal("99.99")).tipo(TipoProducto.SERVICIO_HOGAR).informacionAdicional("Costo mensual, período mínimo 6 meses.").build());

        UUID id3 = UUID.randomUUID();
        components.put(id3, ProductoLeaf.builder().id(id3).nombre("Plan Postpago Ilimitado").precioBase(new BigDecimal("49.50")).tipo(TipoProducto.SERVICIO_MOVIL).informacionAdicional("Costo mensual, período mínimo 6 meses.").build());

        UUID id4 = UUID.randomUUID();
        components.put(id4, ProductoLeaf.builder().id(id4).nombre("TV Cable Premium").precioBase(new BigDecimal("60.00")).tipo(TipoProducto.SERVICIO_HOGAR).informacionAdicional("Costo mensual, período mínimo 6 meses.").build());
    }

    public List<IProductoComponent> findAll() {
        return new ArrayList<>(components.values());
    }

    public Optional<IProductoComponent> findById(UUID id) {
        return Optional.ofNullable(components.get(id));
    }

    public Optional<ProductoLeaf> findProductoLeafById(UUID id) {
        IProductoComponent component = components.get(id);
        if (component instanceof ProductoLeaf leaf) {
            return Optional.of(leaf);
        }
        return Optional.empty();
    }

    public IProductoComponent save(IProductoComponent component) {
        components.put(component.getId(), component);
        return component;
    }

    public List<ProductoLeaf> findAllLeaves() {
        return components.values().stream()
                .filter(c -> c.getTipo() != TipoProducto.COMBO)
                .map(c -> (ProductoLeaf) c)
                .collect(Collectors.toList());
    }

    public List<ComboComposite> findAllCombos() {
        return components.values().stream()
                .filter(c -> c.getTipo() == TipoProducto.COMBO)
                .map(c -> (ComboComposite) c)
                .collect(Collectors.toList());
    }
}