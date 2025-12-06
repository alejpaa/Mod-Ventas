package com.venta.backend.common.examples;

import com.venta.backend.cliente.application.dto.request.RegistroClienteRequest;
import com.venta.backend.cliente.application.dto.response.ClienteResponse;
import com.venta.backend.cliente.application.servicios.IClienteAdminServicio;
import com.venta.backend.common.util.LoggingUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * EJEMPLO COMPLETO: Integración de Logging con MDC
 * 
 * Este controlador muestra cómo usar LoggingUtils para rastrear
 * acciones de usuarios en los logs.
 * 
 * PATRÓN DE USO:
 * 1. Al inicio del método, establecer el userId con LoggingUtils.setUserId(...)
 * 2. Realizar operaciones normales
 * 3. Los logs automáticamente incluirán el userId
 * 
 * NO ES NECESARIO crear este archivo en tu proyecto,
 * solo COPIA las líneas marcadas con "👉" a tus controladores reales.
 */
@Slf4j  // 👉 IMPORTANTE: Agregar esta anotación para usar log
@RestController
@RequestMapping("/api/examples/clientes-con-logs")
@RequiredArgsConstructor
public class ClienteControllerConLogsEJEMPLO {

    private final IClienteAdminServicio adminServicio;

    /**
     * EJEMPLO 1: Registrar un nuevo cliente
     * Muestra cómo establecer el userId al inicio del método
     */
    @PostMapping
    public ResponseEntity<ClienteResponse> registrarCliente(@RequestBody RegistroClienteRequest request) {
        
        // 👉 LÍNEA CRÍTICA: Establecer el DNI del cliente como userId
        // Esto hará que TODOS los logs subsiguientes muestren este ID
        LoggingUtils.setUserId(request.getDni());
        
        // 👉 Ahora puedes hacer logs normales con log.info
        log.info("Iniciando registro de nuevo cliente: {} {}", request.getFirstName(), request.getLastName());
        
        try {
            ClienteResponse response = adminServicio.registrarCliente(request);
            
            // 👉 Log de éxito - automáticamente incluirá el dni en el log
            log.info("Cliente registrado exitosamente con ID: {}", response.getClienteId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            // 👉 Log de error - también incluirá el dni
            log.error("Error al registrar cliente", e);
            throw e;
        }
    }

    /**
     * EJEMPLO 2: Actualizar cliente existente
     * Muestra cómo usar el ID del cliente para tracking
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> actualizarCliente(
            @PathVariable Long id,
            @RequestBody Object request) {
        
        // 👉 Opción 1: Usar el ID del cliente
        LoggingUtils.setUserId(id);
        
        log.info("Actualizando datos del cliente");
        
        // ... resto de la lógica
        
        return ResponseEntity.ok().build();
    }

    /**
     * EJEMPLO 3: Simulación de Login
     * Muestra cómo establecer el userId después de autenticación
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String dni, @RequestParam String password) {
        
        log.info("Intento de login para DNI: {}", dni);
        
        // Simular validación de credenciales
        boolean autenticado = validateCredentials(dni, password);
        
        if (autenticado) {
            // 👉 CRÍTICO: Después de autenticar, establecer el userId
            LoggingUtils.setUserId(dni);
            
            log.info("Login exitoso");
            
            return ResponseEntity.ok("Login exitoso");
        } else {
            log.warn("Login fallido - credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    /**
     * EJEMPLO 4: Logout
     * Muestra cómo limpiar el userId
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        String currentUser = LoggingUtils.getUserId();
        
        log.info("Usuario {} cerrando sesión", currentUser);
        
        // 👉 Al hacer logout, limpiar el context
        LoggingUtils.clearUser();
        
        log.info("Sesión cerrada");
        
        return ResponseEntity.ok("Logout exitoso");
    }

    /**
     * EJEMPLO 5: Consulta de datos
     * El userId ya estará establecido si el usuario hizo login antes
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> obtenerCliente(@PathVariable Long id) {
        
        // 👉 NO es necesario establecer userId si ya está en sesión
        // Pero puedes hacerlo si quieres sobrescribir temporalmente
        
        log.info("Consultando datos del cliente ID: {}", id);
        
        // ... lógica
        
        return ResponseEntity.ok().build();
    }

    // Método auxiliar de ejemplo
    private boolean validateCredentials(String dni, String password) {
        // Lógica de validación
        return true;
    }
}

/**
 * RESUMEN DE USO:
 * 
 * 1. Agregar @Slf4j a tu controlador
 * 2. Al inicio de métodos importantes, llamar: LoggingUtils.setUserId(...)
 * 3. Usar log.info(...), log.warn(...), log.error(...) normalmente
 * 4. Los logs mostrarán: [FECHA] [TRACE-ID] [USER-ID] [MENSAJE]
 * 
 * FORMATO DE LOG RESULTANTE:
 * 2025-12-06 03:45:12.345 [a1b2c3d4] [12345678] [http-nio-8080-exec-1] INFO  c.v.b.cliente.controller.ClienteController - Iniciando registro de nuevo cliente: Juan Pérez
 * 2025-12-06 03:45:12.567 [a1b2c3d4] [12345678] [http-nio-8080-exec-1] INFO  c.v.b.cliente.service.ClienteService - Validando DNI...
 * 2025-12-06 03:45:12.789 [a1b2c3d4] [12345678] [http-nio-8080-exec-1] INFO  c.v.b.cliente.controller.ClienteController - Cliente registrado exitosamente con ID: 1001
 */
