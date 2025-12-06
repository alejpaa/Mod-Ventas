package com.venta.backend.producto.controller;

import com.venta.backend.producto.entity.Producto;
import com.venta.backend.producto.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador para verificar la conexión a la base de datos
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DatabaseTestController {

    private final DataSource dataSource;
    private final ProductoRepository productoRepository;

    /**
     * Endpoint simple para verificar que el servidor está corriendo
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Servidor funcionando correctamente");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para verificar la conexión a la base de datos
     */
    @GetMapping("/db-connection")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Intentar obtener una conexión
            Connection connection = dataSource.getConnection();

            response.put("status", "SUCCESS");
            response.put("connected", true);
            response.put("database", connection.getCatalog());
            response.put("url", connection.getMetaData().getURL());
            response.put("driverName", connection.getMetaData().getDriverName());
            response.put("driverVersion", connection.getMetaData().getDriverVersion());
            response.put("message", "Conexión a la base de datos exitosa");

            connection.close();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("connected", false);
            response.put("message", "Error al conectar a la base de datos");
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());

            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint para contar productos en la base de datos
     */
    @GetMapping("/count-productos")
    public ResponseEntity<Map<String, Object>> countProductos() {
        Map<String, Object> response = new HashMap<>();

        try {
            long count = productoRepository.count();
            List<Producto> productos = productoRepository.findAll();

            response.put("status", "SUCCESS");
            response.put("totalProductos", count);
            response.put("message", "Consulta exitosa");

            if (count > 0) {
                response.put("primerProducto", productos.get(0).getNombre());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error al consultar productos");
            response.put("error", e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint de health check personalizado
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> checks = new HashMap<>();

        // Check 1: Servidor
        checks.put("servidor", "OK");

        // Check 2: Base de datos
        try {
            Connection connection = dataSource.getConnection();
            connection.close();
            checks.put("baseDatos", "OK");
        } catch (Exception e) {
            checks.put("baseDatos", "ERROR: " + e.getMessage());
        }

        // Check 3: Repositorio
        try {
            productoRepository.count();
            checks.put("repositorio", "OK");
        } catch (Exception e) {
            checks.put("repositorio", "ERROR: " + e.getMessage());
        }

        boolean allOk = checks.values().stream().allMatch(v -> v.equals("OK"));

        response.put("status", allOk ? "HEALTHY" : "UNHEALTHY");
        response.put("checks", checks);
        response.put("timestamp", java.time.LocalDateTime.now().toString());

        return ResponseEntity.ok(response);
    }
}

