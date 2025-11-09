package com.venta.backend.venta.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/venta")
@RestController
public class VentaController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Venta!";
    }
}
