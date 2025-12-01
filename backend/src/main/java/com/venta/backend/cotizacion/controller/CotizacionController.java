package com.venta.backend.cotizacion.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cotizaciones")
public class CotizacionController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Cotizacion!";
    }
}
