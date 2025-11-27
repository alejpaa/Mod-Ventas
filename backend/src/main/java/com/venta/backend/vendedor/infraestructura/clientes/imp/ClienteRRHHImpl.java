package com.venta.backend.vendedor.infraestructura.clientes.imp;

import com.venta.backend.vendedor.infraestructura.clientes.IClienteRRHH;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Implementación SIMULADA del cliente RRHH
 * En producción, esto haría llamadas HTTP reales al módulo RRHH
 */
@Component
public class ClienteRRHHImpl implements IClienteRRHH {

    @Override
    public Optional<EmpleadoRRHHDTO> getEmployeeByDni(String dni) {
        // SIMULACIÓN: En producción usarías RestTemplate o WebClient
        // para hacer una llamada HTTP al microservicio de RRHH

        // Ejemplo: GET http://rrhh-service/api/empleados/{dni}

        // Datos de prueba simulados
        if (dni.equals("12345678")) {
            EmpleadoRRHHDTO empleado = new EmpleadoRRHHDTO();
            empleado.setDni("12345678");
            empleado.setFirstName("Juan");
            empleado.setLastName("Pérez García");
            empleado.setEmail("juan.perez@empresa.com");
            empleado.setPhoneNumber("987654321");
            empleado.setAddress("Av. Los Olivos 123, Lima");
            return Optional.of(empleado);
        }

        if (dni.equals("87654321")) {
            EmpleadoRRHHDTO empleado = new EmpleadoRRHHDTO();
            empleado.setDni("87654321");
            empleado.setFirstName("María");
            empleado.setLastName("López Sánchez");
            empleado.setEmail("maria.lopez@empresa.com");
            empleado.setPhoneNumber("987654322");
            empleado.setAddress("Av. La Marina 456, Lima");
            return Optional.of(empleado);
        }

        // Si no encuentra el DNI, retorna Optional vacío
        return Optional.empty();
    }
}
