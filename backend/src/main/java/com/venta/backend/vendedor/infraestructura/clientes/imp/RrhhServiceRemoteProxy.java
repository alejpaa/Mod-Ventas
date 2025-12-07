package com.venta.backend.vendedor.infraestructura.clientes.imp;

import com.venta.backend.vendedor.infraestructura.clientes.IRrhhServiceSubject;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import java.util.Arrays;
import java.util.Optional;

/**
 * Implementación del cliente RRHH que realiza llamadas HTTP reales
 * (Proxy Remoto)
 */
@Component
public class RrhhServiceRemoteProxy implements IRrhhServiceSubject {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String rrhhBaseUrl = "https://unregenerable-nonaesthetically-lara.ngrok-free.dev/api";

    @Override
    public Optional<EmpleadoRRHHDTO> getEmployeeByDni(String dni) {
        // La URL base que devuelve el arreglo de todos los empleados
        String url = rrhhBaseUrl + "/gempleados/area/ventas";

        try {
            EmpleadoRRHHDTO[] responseArray = restTemplate.getForObject(url, EmpleadoRRHHDTO[].class);

            if (responseArray == null) {
                return Optional.empty();
            }

            return Arrays.stream(responseArray)
                    .filter(empleado -> dni.equals(empleado.getDocumentoIdentidad()))
                    .findFirst();

        } catch (HttpClientErrorException.NotFound ex) {
            return Optional.empty();
        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}