package com.venta.backend.vendedor.services.imp;

import com.venta.backend.vendedor.services.ISellerOnboardingService;
import com.venta.backend.vendedor.entities.Vendedor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SellerOnboardingServiceImpl implements ISellerOnboardingService {
    @Override
    public void onboardSeller(Vendedor newSeller) {
        // Lógica de generación de PDF y envío de correo

        // Lógica Simulada por el momento:
        if (newSeller.getEmail() == null || newSeller.getEmail().isBlank()) {
            log.warn("Introducción de corporación Fallida: No se pudo enviar el email de bienvenida al vendedor ID {} por falta de correo.",
                    newSeller.getSellerId());
            return;
        }

        log.info("Introducción de corporación: Enviando paquete de bienvenida y manual PDF a {} ({})",
                newSeller.getFullName(), newSeller.getEmail());

        // Lógica para generar email
    }
}
