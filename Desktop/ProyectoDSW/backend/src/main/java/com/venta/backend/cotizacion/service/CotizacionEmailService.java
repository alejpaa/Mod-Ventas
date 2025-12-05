package com.venta.backend.cotizacion.service;

import com.venta.backend.cotizacion.model.Cotizacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CotizacionEmailService {

    

    public void enviarCotizacion(Cotizacion cotizacion, String destinatario, String enlaceAceptacion) {
        // TODO: Implementar envío de correo
    }
}

