package com.venta.backend.producto.builder;

import com.venta.backend.producto.dto.ComboRequest;
import com.venta.backend.producto.model.ComboComposite;
import org.springframework.stereotype.Component;

// Builder Pattern: Director (Orchestrator)
@Component
public class ComboDirector {

    private final ComboBuilder comboBuilder;

    public ComboDirector(ComboBuilder comboBuilder) {
        this.comboBuilder = comboBuilder;
    }

    public ComboComposite construirComboConDescuentos(ComboRequest request) {
        return comboBuilder.reset()
                .withRequest(request)
                .buildComponentesConDescuento()
                .getResult();
    }
}