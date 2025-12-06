package com.venta.backend.descuento.infraestructura.controller;

import com.venta.backend.descuento.aplicacion.CuponAdminService;
import com.venta.backend.descuento.DTO.CrearCuponLoteRequest;
import com.venta.backend.descuento.DTO.CuponResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cupones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class CuponAdminController {

    private final CuponAdminService cuponAdminService;

    // CRUD ENDPOINTS
    @PostMapping
    public ResponseEntity<List<CuponResponse>> crearCuponesEnLote(@RequestBody CrearCuponLoteRequest request) {
        try {
            // El status 201 Created es apropiado para la creación exitosa de recursos.
            return new ResponseEntity<>(cuponAdminService.crearCuponesEnLote(request), HttpStatus.CREATED); 
        } catch (RuntimeException e) {
            // En caso de error de validación o código existente
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); 
        }
    }

    /**
     * Endpoint GET para obtener un cupón por su ID.
     * URL: /api/admin/cupones/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CuponResponse> obtenerCuponPorId(@PathVariable Long id) {
        try {
            CuponResponse response = cuponAdminService.obtenerPorId(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Si no se encuentra el recurso, se retorna 404 NOT FOUND (asumiendo que el servicio lanza una excepción)
            return ResponseEntity.notFound().build(); 
        }
    }

    /**
     * Endpoint PUT para actualizar un cupón existente por su ID.
     * URL: /api/admin/cupones/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CuponResponse> actualizarCupon(@PathVariable Long id, @RequestBody CrearCuponRequest request) {
        try {
            CuponResponse response = cuponAdminService.actualizarCupon(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Si el cupón no existe, 404 NOT FOUND. Si es un error de validación, 400 BAD REQUEST.
            // Para simplificar, devolvemos 404 si el recurso no es encontrado.
            if (e.getMessage() != null && e.getMessage().contains("no encontrado")) {
                 return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Endpoint DELETE para eliminar un cupón por su ID.
     * URL: /api/admin/cupones/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCupon(@PathVariable Long id) {
        try {
            cuponAdminService.eliminarCupon(id);
            // 204 No Content es la respuesta RESTful correcta para una eliminación exitosa
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
            // Si no se encuentra el recurso, se retorna 404 NOT FOUND
            return ResponseEntity.notFound().build();
        }
    }    
}