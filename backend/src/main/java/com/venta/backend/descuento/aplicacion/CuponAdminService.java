package com.venta.backend.descuento.aplicacion;

import com.venta.backend.descuento.DTO.CrearCuponRequest;
import com.venta.backend.descuento.DTO.CuponResponse;
import com.venta.backend.descuento.dominio.entidades.Cupon;
import com.venta.backend.descuento.infraestructura.repository.CuponRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.security.SecureRandom; // Importación necesaria para generar códigos

/**
 * Servicio para la gestión de la administración (CRUD) de Cupones.
 */
@Service
@RequiredArgsConstructor
public class CuponAdminService {

    private final CuponRepositorio cuponRepositorio;

    // --- UTILERÍAS DE GENERACIÓN DE CÓDIGO ---
    private static final String CARACTERES_PERMITIDOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LONGITUD_CODIGO = 10;
    private static final SecureRandom random = new SecureRandom();

    /**
     * Genera un código aleatorio de 10 caracteres y verifica que no exista en la DB.
     * @return Código único no repetido.
     */
    private String generarCodigoUnico() {
        String nuevoCodigo;
        Optional<Cupon> cuponExistente;

        // Se repite hasta encontrar un código no existente en la DB
        do {
            StringBuilder sb = new StringBuilder(LONGITUD_CODIGO);
            for (int i = 0; i < LONGITUD_CODIGO; i++) {
                int indice = random.nextInt(CARACTERES_PERMITIDOS.length());
                sb.append(CARACTERES_PERMITIDOS.charAt(indice));
            }
            nuevoCodigo = sb.toString();

            // Usamos el repositorio para verificar la unicidad
            cuponExistente = cuponRepositorio.findByCodigo(nuevoCodigo);
        } while (cuponExistente.isPresent());

        return nuevoCodigo;
    }
    // -------------------------------------------


    // -------------------------------------------------------------------------
    // C R E A R - MODIFICADO para auto-generación y uso único
    // -------------------------------------------------------------------------
    public CuponResponse crearCupon(CrearCuponRequest request) {
        // 1. Generar el código automáticamente y único
        String codigoGenerado = generarCodigoUnico(); 

        // 2. Mapear y establecer código/uso máximo
        Cupon nuevoCupon = mapFromRequest(request);
        
        nuevoCupon.setCodigo(codigoGenerado); // Establece el código único generado

        // 3. Forzar el uso a 1
        nuevoCupon.setUsosMaximos(1); // El cupón es válido solo para 1 uso.

        // 4. Guardar y retornar
        nuevoCupon = cuponRepositorio.save(nuevoCupon);
        return mapToResponse(nuevoCupon);
    }

    // -------------------------------------------------------------------------
    // L E E R - Todos
    // -------------------------------------------------------------------------
    public List<CuponResponse> listarTodos() {
        return cuponRepositorio.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // L E E R - Por ID (Método Faltante 1)
    // -------------------------------------------------------------------------
    public CuponResponse obtenerPorId(Long id) {
        Cupon cupon = cuponRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado con ID: " + id));
        
        return mapToResponse(cupon);
    }

    // -------------------------------------------------------------------------
    // A C T U A L I Z A R (Método Faltante 2)
    // -------------------------------------------------------------------------
    public CuponResponse actualizarCupon(Long id, CrearCuponRequest request) {
        // 1. Verificar si el cupón existe
        Cupon cuponExistente = cuponRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado con ID: " + id));

        // 2. Verificar si el código ha cambiado y ya existe otro con ese código
        if (!cuponExistente.getCodigo().equals(request.getCodigo())) {
             Optional<Cupon> otroCuponConMismoCodigo = cuponRepositorio.findByCodigo(request.getCodigo());
             if (otroCuponConMismoCodigo.isPresent() && !otroCuponConMismoCodigo.get().getId().equals(id)) {
                 throw new RuntimeException("El nuevo código de cupón ya está en uso.");
             }
        }

        // 3. Actualizar campos
        cuponExistente.setCodigo(request.getCodigo());
        cuponExistente.setTipoDescuento(request.getTipoDescuento());
        cuponExistente.setValor(request.getValor());
        cuponExistente.setFechaExpiracion(request.getFechaExpiracion());
        cuponExistente.setUsosMaximos(request.getUsosMaximos());
        cuponExistente.setMontoMinimoRequerido(request.getMontoMinimoRequerido());

        // 4. Guardar y retornar
        Cupon cuponActualizado = cuponRepositorio.save(cuponExistente);
        return mapToResponse(cuponActualizado);
    }

    // -------------------------------------------------------------------------
    // E L I M I N A R (Método Faltante 3)
    // -------------------------------------------------------------------------
    public void eliminarCupon(Long id) {
        // Verificamos que exista para lanzar 404 en el controlador
        if (!cuponRepositorio.existsById(id)) {
            throw new RuntimeException("Cupón no encontrado con ID: " + id);
        }
        cuponRepositorio.deleteById(id);
    }

    // -------------------------------------------------------------------------
    // M A P E A D O R E S (Modificado: se elimina la asignación de 'codigo' y 'usosMaximos' del request)
    // -------------------------------------------------------------------------
    private Cupon mapFromRequest(CrearCuponRequest request) {
        Cupon cupon = new Cupon();
        // Eliminado: cupon.setCodigo(request.getCodigo());
        cupon.setTipoDescuento(request.getTipoDescuento());
        cupon.setValor(request.getValor());
        cupon.setFechaExpiracion(request.getFechaExpiracion());
        // Eliminado: cupon.setUsosMaximos(request.getUsosMaximos());
        cupon.setMontoMinimoRequerido(request.getMontoMinimoRequerido() != null ? request.getMontoMinimoRequerido() : new java.math.BigDecimal("0.00"));
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