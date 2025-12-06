package com.venta.backend.venta.factory;

import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;

public interface VentaFactory {

    OrigenVenta origenSoportado();

    Venta crearVentaBorrador();
}

