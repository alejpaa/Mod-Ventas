package com.venta.backend.producto.service;

import com.venta.backend.producto.dto.ProductoDTO;
import com.venta.backend.producto.enums.TipoProducto;
import com.venta.backend.producto.repository.IProductoComponentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoQueryService {

    private final IProductoComponentRepository repository;

    public ProductoQueryService(IProductoComponentRepository repository) {
        this.repository = repository;
    }

    // Funcionalidad para el Vendedor (E-commerce View)
    public List<ProductoDTO> obtenerTodosLosComponentes(TipoProducto filtroTipo) {
        // El Composite Pattern nos permite iterar sobre todos (Productos y Combos)
        List<ProductoDTO> todos = repository.findAll().stream()
                .map(ProductoDTO::fromComponent)
                .collect(Collectors.toList());

        if (filtroTipo != null) {
            return todos.stream()
                    .filter(dto -> dto.getTipo() == filtroTipo)
                    .collect(Collectors.toList());
        }

        return todos;
    }
}