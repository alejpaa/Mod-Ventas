package com.venta.backend.venta.application.factory;

import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.enums.OrigenVenta;

public interface IVentaFactory {

    OrigenVenta origenSoportado();

    Venta crearVentaBorrador(VentaDraftData data);
}

