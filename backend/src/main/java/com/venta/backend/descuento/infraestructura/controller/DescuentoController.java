package com.venta.backend.descuento.infraestructura.controller;

import com.venta.backend.descuento.aplicacion.DiscountService;
import com.venta.backend.descuento.DTO.AplicarDescuentoRequest;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Define la ruta base para este controlador
@RestController
@RequestMapping("/api/descuentos")
// @CrossOrigin(origins = "http://localhost:5173") // Opcional: Define el puerto específico de React.
@CrossOrigin(origins = "*") // Permite el acceso desde cualquier origen (Recomendado para desarrollo/pruebas)
public class DescuentoController {

    private final DiscountService discountService;

    /**
     * Inyección de dependencia del servicio de negocio (DiscountService)
     * Spring se encarga de crear e inyectar la instancia (@Autowired implícito en el constructor).
     */
    public DescuentoController(DiscountService discountService) {
        this.discountService = discountService;
    }

    /**
     * Endpoint POST para aplicar el mejor descuento posible a una Venta.
     * URL: /api/descuentos/aplicar-mejor-descuento
     */
    @PostMapping("/aplicar-mejor-descuento")
    public ResponseEntity<DescuentoAplicadoResponse> aplicarMejorDescuento(@RequestBody AplicarDescuentoRequest request) {

        // Se recomienda que los DTOs de Request usen los Getters para acceder a los datos.
        if (request.getDniCliente() == null || request.getVentaId() == null) {
            // Manejo básico de datos faltantes
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new DescuentoAplicadoResponse("ERROR_DATOS", null, null, "VentaId y DNI del cliente son requeridos.")
            );
        }

        try {
            // Llama al servicio de aplicación (donde se implementa la lógica de las Reglas y la Estrategia)
            DescuentoAplicadoResponse response = discountService.aplicarMejorDescuento(request);

            // Retorna una respuesta exitosa con el resultado del descuento
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Manejo genérico de excepciones de negocio (Ej. Venta no encontrada, Cupón expirado)
            System.err.println("Error al aplicar el descuento: " + e.getMessage());

            // Retorna un código de error 400 (Bad Request) con un mensaje del error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new DescuentoAplicadoResponse("ERROR_APLICACION", null, null, e.getMessage())
            );
        }
    }
}