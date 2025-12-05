package com.venta.backend.venta.application.servicios;

import com.venta.backend.venta.application.dto.request.CrearVentaLeadRequest;
import com.venta.backend.venta.application.dto.response.VentaLeadResponse;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.entities.VentaLead;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import com.venta.backend.venta.infraestructura.repository.VentaLeadRepositorio;
import com.venta.backend.venta.infraestructura.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VentaLeadService {

    private final VentaRepositorio ventaRepositorio;
    private final VentaLeadRepositorio ventaLeadRepositorio;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public VentaLeadResponse crearVentaDesdeLeadMarketing(CrearVentaLeadRequest request) {
        
        // 1. Registrar cliente usando el endpoint de clientes
        Long clienteId = registrarCliente(request);
        
        // 2. Generar número de venta para LEAD
        String numVenta = generarNumeroVenta(OrigenVenta.LEAD);
        
        // 3. Crear venta en estado BORRADOR
        Venta venta = Venta.builder()
                .numVenta(numVenta)
                .origenVenta(OrigenVenta.LEAD)
                .estado(VentaEstado.BORRADOR)
                .fechaVentaCreada(LocalDate.now())
                .subtotal(BigDecimal.ZERO)
                .descuentoTotal(BigDecimal.ZERO)
                .total(BigDecimal.ZERO)
                .build();
        
        Venta ventaGuardada = ventaRepositorio.save(venta);
        
        // 4. Crear registro en VentaLead
        VentaLead ventaLead = VentaLead.builder()
                .venta(ventaGuardada)
                .idLeadMarketing(request.getIdLeadMarketing())
                .canalOrigen(request.getCanalOrigen())
                .idCampaniaMarketing(request.getIdCampaniaMarketing())
                .nombreCampania(request.getNombreCampania())
                .tematica(request.getTematica())
                .descripcion(request.getDescripcion())
                .notasLlamada(request.getNotasLlamada())
                .fechaEnvio(request.getFechaEnvio())
                .build();
        
        ventaLeadRepositorio.save(ventaLead);
        
        // 5. Retornar respuesta
        return VentaLeadResponse.builder()
                .ventaId(ventaGuardada.getId())
                .numVenta(ventaGuardada.getNumVenta())
                .clienteId(clienteId)
                .mensaje("Venta creada exitosamente desde lead de marketing")
                .build();
    }

    private Long registrarCliente(CrearVentaLeadRequest request) {
        try {
            // Preparar request para el endpoint de clientes
            Map<String, Object> clienteRequest = new HashMap<>();
            clienteRequest.put("dni", request.getDni());
            clienteRequest.put("firstName", request.getNombres());
            clienteRequest.put("lastName", request.getApellidos());
            clienteRequest.put("email", request.getCorreo());
            clienteRequest.put("phoneNumber", request.getTelefono());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(clienteRequest, headers);
            
            // Llamar al endpoint de registro de clientes
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "http://localhost:8080/api/clientes/registroClientes",
                    entity,
                    Map.class
            );
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("clienteId")) {
                return ((Number) responseBody.get("clienteId")).longValue();
            }
            
            throw new RuntimeException("No se pudo obtener el ID del cliente registrado");
            
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar cliente: " + e.getMessage(), e);
        }
    }

    private String generarNumeroVenta(OrigenVenta origen) {
        String prefijo = "VTA-LED-";
        
        // Buscar la última venta del mismo origen
        return ventaRepositorio.findFirstByOrigenVentaOrderByIdDesc(origen)
                .map(ultimaVenta -> {
                    String ultimoNumero = ultimaVenta.getNumVenta();
                    // Extraer el número secuencial (últimos 6 dígitos)
                    String numeroStr = ultimoNumero.substring(ultimoNumero.length() - 6);
                    int numero = Integer.parseInt(numeroStr);
                    return String.format("%s%06d", prefijo, numero + 1);
                })
                .orElse(prefijo + "000001"); // Primera venta de este origen
    }
}
