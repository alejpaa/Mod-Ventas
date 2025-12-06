package com.venta.backend.descuento.aplicacion;

import com.venta.backend.descuento.DTO.CrearCuponRequest;
import com.venta.backend.descuento.DTO.CuponResponse;
import com.venta.backend.descuento.dominio.entidades.Cupon;
import com.venta.backend.descuento.infraestructura.repository.CuponRepositorio;
import com.venta.backend.descuento.DTO.CrearCuponLoteRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.security.SecureRandom;
import java.util.ArrayList; // Importación necesaria para generar códigos

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
    // C R E A R C U P O N E S (Lote) - NUEVO MÉTODO CENTRAL DE CREACIÓN
    // -------------------------------------------------------------------------
    public List<CuponResponse> crearCuponesEnLote(CrearCuponLoteRequest request) {
        
        String prefijo = request.getNombreCampana().toUpperCase().trim();
        int cantidad = request.getCantidadCupones();
        int longitudSecuencia = String.valueOf(cantidad).length(); // Para NAVIDAD25001, longitud es 3 (si es hasta 100)
        
        List<Cupon> nuevosCupones = new ArrayList<>();
        
        // 1. Generar y validar todos los cupones antes de guardar.
        for (int i = 1; i <= cantidad; i++) {
            // Formato secuencial (ej: 001, 002, 010, 100)
            String sufijo = String.format("%0" + longitudSecuencia + "d", i);
            String codigoGenerado = prefijo + sufijo;
            
            // 2. Verificar unicidad (es crucial aquí)
            if (cuponRepositorio.findByCodigo(codigoGenerado).isPresent()) {
                 // Si se encuentra, lanza una excepción para detener todo el lote.
                 throw new RuntimeException("El código de cupón " + codigoGenerado + " ya existe en la base de datos. No se creó ningún cupón.");
            }
            
            Cupon nuevoCupon = new Cupon();
            nuevoCupon.setCodigo(codigoGenerado); // Código secuencial
            
            // 3. Mapear datos comunes y forzar la restricción anterior de uso único (si aplica)
            nuevoCupon.setTipoDescuento(request.getTipoDescuento());
            nuevoCupon.setValor(request.getValor());
            nuevoCupon.setFechaExpiracion(request.getFechaExpiracion());
            
            nuevoCupon.setUsosMaximos(1); // <--- REQUISITO ANTERIOR: Uso único
            
            nuevoCupon.setMontoMinimoRequerido(request.getMontoMinimoRequerido());
            
            nuevosCupones.add(nuevoCupon);
        }

        // 4. Guardar todos los cupones en la base de datos (se usa saveAll para eficiencia)
        List<Cupon> cuponesGuardados = cuponRepositorio.saveAll(nuevosCupones);
        
        // 5. Mapear a respuesta
        return cuponesGuardados.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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