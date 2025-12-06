package com.venta.backend.producto.model;

import com.venta.backend.producto.enums.TipoProducto;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// Composite Component - Combo
@Getter
@Setter
public class ComboComposite implements IProductoComponent {

    private UUID id;
    private String nombre;
    private TipoProducto tipo = TipoProducto.COMBO;
    private String informacionAdicional = "Combo especial con múltiples productos y descuentos.";

    // Lista de productos que forman el combo. Puede contener otros Combos si fuera necesario.
    private List<IProductoComponent> componentes = new ArrayList<>();

    // Propiedades del combo
    private BigDecimal descuentoTotal;
    private BigDecimal precioTotalBase;
    private BigDecimal precioTotalFinal;

    public ComboComposite(UUID id, String nombre) {
        this.id = id;
        this.nombre = nombre;
        this.calcularTotales();
    }

    public void agregarComponente(IProductoComponent componente) {
        this.componentes.add(componente);
        this.calcularTotales();
    }

    public void removerComponente(IProductoComponent componente) {
        this.componentes.remove(componente);
        this.calcularTotales();
    }

    private void calcularTotales() {
        this.precioTotalBase = componentes.stream()
                .map(IProductoComponent::getPrecioBase)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.precioTotalFinal = componentes.stream()
                .map(IProductoComponent::getPrecioFinal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.descuentoTotal = this.precioTotalBase.subtract(this.precioTotalFinal);
    }

    // El precio base del Combo es la suma de los precios base de sus componentes.
    @Override
    public BigDecimal getPrecioBase() {
        return this.precioTotalBase;
    }

    // El precio final del Combo es la suma de los precios finales (con descuento) de sus componentes.
    @Override
    public BigDecimal getPrecioFinal() {
        return this.precioTotalFinal;
    }
}