package com.venta.backend.producto.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.venta.backend.producto.builder.ComboDirector;
import com.venta.backend.producto.dto.ComboRequest;
import com.venta.backend.producto.dto.ProductoDTO;
import com.venta.backend.producto.model.ComboComposite;
import com.venta.backend.producto.repository.IProductoComponentRepository;

@Service
public class ProductoAdminService {

    private final IProductoComponentRepository repository;
    private final ComboDirector comboDirector;

    public ProductoAdminService(IProductoComponentRepository repository, ComboDirector comboDirector) {
        this.repository = repository;
        this.comboDirector = comboDirector;
    }

    // Funcionalidad 1: Obtener todos los productos para la creación de combos
    public List<ProductoDTO> obtenerProductosDisponibles() {
        // Solo retorna los ProductoLeaf
        return repository.findAllLeaves().stream()
                .map(ProductoDTO::fromComponent)
                .collect(Collectors.toList());
    }

    // Funcionalidad 2: Crear Combo (Builder Pattern)
    public ProductoDTO crearCombo(ComboRequest request) {
        // Utiliza el Director y Builder para aplicar la lógica de descuentos
        ComboComposite combo = comboDirector.construirComboConDescuentos(request);

        repository.save(combo);

        return ProductoDTO.fromComponent(combo);
    }

    // Funcionalidad 3: Obtener lista de Combos (para mostrar al administrador)
    public List<ProductoDTO> obtenerListaCombos() {
        return repository.findAllCombos().stream()
                .map(ProductoDTO::fromComponent)
                .collect(Collectors.toList());
    }

    // Funcionalidad 4: Obtener detalle de Combo (para el clic del administrador)
    public ProductoDTO obtenerDetalleCombo(UUID id) {
        return repository.findById(id)
                .filter(c -> c.getTipo().equals(com.venta.backend.producto.enums.TipoProducto.COMBO))
                .map(ProductoDTO::fromComponent)
                .orElseThrow(() -> new com.venta.backend.vendedor.application.exceptions.RecursoNoEncontradoException("Combo no encontrado con ID: " + id));
    }
}