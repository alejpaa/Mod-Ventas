package com.venta.backend.venta.servicios;

import com.venta.backend.cliente.infraestructura.repository.ClienteRepositorio;
import com.venta.backend.venta.dto.response.VentaLeadDetalleResponse;
import com.venta.backend.venta.dto.response.VentaLeadPendienteResponse;
import com.venta.backend.venta.entities.Venta;
import com.venta.backend.venta.entities.VentaLead;
import com.venta.backend.venta.enums.OrigenVenta;
import com.venta.backend.venta.enums.VentaEstado;
import com.venta.backend.venta.repository.VentaLeadRepositorio;
import com.venta.backend.venta.repository.VentaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VentaLeadConsultaService {

    private final VentaRepositorio ventaRepositorio;
    private final VentaLeadRepositorio ventaLeadRepositorio;
    private final ClienteRepositorio clienteRepositorio;

    /**
     * Lista todas las ventas lead que están en estado BORRADOR (pendientes de atender)
     */
    public List<VentaLeadPendienteResponse> listarVentasLeadPendientes() {
        List<Venta> ventasPendientes = ventaRepositorio.findByOrigenVentaAndEstado(
                OrigenVenta.LEAD, 
                VentaEstado.BORRADOR
        );

        return ventasPendientes.stream()
                .map(venta -> {
                    VentaLead ventaLead = ventaLeadRepositorio.findByIdVenta(venta.getId())
                            .orElse(null);
                    
                    if (ventaLead == null) {
                        return null;
                    }

                    // Obtener nombre del cliente
                    String nombreCliente = "Cliente no encontrado";
                    if (venta.getClienteId() != null) {
                        nombreCliente = clienteRepositorio.findById(venta.getClienteId())
                                .map(cliente -> cliente.getFirstName() + " " + cliente.getLastName())
                                .orElse("Cliente no encontrado");
                    }

                    return VentaLeadPendienteResponse.builder()
                            .ventaId(venta.getId())
                            .numVenta(venta.getNumVenta())
                            .nombreCliente(nombreCliente)
                            .nombreCampania(ventaLead.getNombreCampania())
                            .fechaEnvio(ventaLead.getFechaEnvio())
                            .canalOrigen(ventaLead.getCanalOrigen())
                            .build();
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el detalle completo de una venta lead para cargar en el formulario
     */
    public VentaLeadDetalleResponse obtenerDetalleVentaLead(Long ventaId) {
        Venta venta = ventaRepositorio.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        VentaLead ventaLead = ventaLeadRepositorio.findByIdVenta(ventaId)
                .orElseThrow(() -> new RuntimeException("Datos de lead no encontrados"));

        // Obtener datos del cliente
        if (venta.getClienteId() == null) {
            throw new RuntimeException("La venta no tiene un cliente asociado");
        }
        
        var cliente = clienteRepositorio.findById(venta.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        return VentaLeadDetalleResponse.builder()
                // Datos de la venta
                .ventaId(venta.getId())
                .numVenta(venta.getNumVenta())
                // Datos del cliente
                .clienteId(cliente.getClienteId())
                .dni(cliente.getDni())
                .nombres(cliente.getFirstName())
                .apellidos(cliente.getLastName())
                .correo(cliente.getEmail())
                .telefono(cliente.getPhoneNumber())
                // Datos de la campaña
                .idLeadMarketing(ventaLead.getIdLeadMarketing())
                .canalOrigen(ventaLead.getCanalOrigen())
                .idCampaniaMarketing(ventaLead.getIdCampaniaMarketing())
                .nombreCampania(ventaLead.getNombreCampania())
                .tematica(ventaLead.getTematica())
                .descripcion(ventaLead.getDescripcion())
                .notasLlamada(ventaLead.getNotasLlamada())
                .fechaEnvio(ventaLead.getFechaEnvio())
                .build();
    }
}
