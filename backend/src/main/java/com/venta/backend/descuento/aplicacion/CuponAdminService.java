package com.venta.backend.descuento.aplicacion;

import com.venta.backend.descuento.DTO.CrearCuponRequest;
import com.venta.backend.descuento.DTO.CuponResponse;
import com.venta.backend.descuento.dominio.entidades.Cupon;
import com.venta.backend.descuento.infraestructura.repository.CuponRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CuponAdminService {

    private final CuponRepositorio cuponRepositorio;

    public CuponResponse crearCupon(CrearCuponRequest request) {
        if (cuponRepositorio.findByCodigo(request.getCodigo()).isPresent()) {
            throw new RuntimeException("El código de cupón ya existe.");
        }
        Cupon nuevoCupon = mapFromRequest(request);
        nuevoCupon = cuponRepositorio.save(nuevoCupon);
        return mapToResponse(nuevoCupon);
    }

    public List<CuponResponse> listarTodos() {
        return cuponRepositorio.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // Implementar métodos para obtenerPorId, actualizar y eliminar...

    // --- Mapeadores (Puedes usar MapStruct para esto) ---
    private Cupon mapFromRequest(CrearCuponRequest request) {
        Cupon cupon = new Cupon();
        cupon.setCodigo(request.getCodigo());
        cupon.setTipoDescuento(request.getTipoDescuento());
        cupon.setValor(request.getValor());
        cupon.setFechaExpiracion(request.getFechaExpiracion());
        cupon.setUsosMaximos(request.getUsosMaximos());
        cupon.setMontoMinimoRequerido(request.getMontoMinimoRequerido());
        return cupon;
    }

    private CuponResponse mapToResponse(Cupon cupon) {
        CuponResponse response = new CuponResponse();
        response.setId(cupon.getId());
        response.setCodigo(cupon.getCodigo());
        response.setTipoDescuento(cupon.getTipoDescuento());
        response.setValor(cupon.getValor());
        response.setFechaExpiracion(cupon.getFechaExpiracion());
        response.setUsosMaximos(cupon.getUsosMaximos());
        response.setUsosActuales(cupon.getUsosActuales());
        response.setMontoMinimoRequerido(cupon.getMontoMinimoRequerido());
        response.setEstado(cupon.estaExpirado() ? "EXPIRADO" : (cupon.tieneUsosDisponibles() ? "ACTIVO" : "AGOTADO"));
        return response;
    }
}