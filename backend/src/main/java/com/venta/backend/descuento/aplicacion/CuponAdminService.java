package com.venta.backend.descuento.aplicacion;

import com.venta.backend.descuento.DTO.CrearCuponLoteRequest; // Importar DTO de lote
import com.venta.backend.descuento.DTO.CrearCuponRequest; // Se mantiene para actualizarCupon
import com.venta.backend.descuento.DTO.CuponResponse;
import com.venta.backend.descuento.dominio.entidades.Cupon;
import com.venta.backend.descuento.infraestructura.repository.CuponRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de la administración (CRUD) de Cupones.
 */
@Service
@RequiredArgsConstructor
public class CuponAdminService {

    private final CuponRepositorio cuponRepositorio;

    // -------------------------------------------------------------------------
    // C R E A R C U P O N E S (Lote) - NUEVA IMPLEMENTACIÓN
    // -------------------------------------------------------------------------
    public List<CuponResponse> crearCuponesEnLote(CrearCuponLoteRequest request) {
        
        String prefijo = request.getNombreCampana().toUpperCase().trim();
        int cantidad = request.getCantidadCupones();
        
        // Determina la longitud de la parte secuencial (ej: 100 cupones -> 3 dígitos)
        int longitudSecuencia = String.valueOf(cantidad).length(); 
        
        List<Cupon> nuevosCupones = new ArrayList<>();
        
        // 1. Bucle para generar y preparar todos los cupones
        for (int i = 1; i <= cantidad; i++) {
            // Formato secuencial (ej: %03d para 3 dígitos, rellena con ceros)
            String sufijo = String.format("%0" + longitudSecuencia + "d", i);
            String codigoGenerado = prefijo + sufijo;
            
            // 2. Verificar unicidad. Detiene todo si el código ya existe.
            if (cuponRepositorio.findByCodigo(codigoGenerado).isPresent()) {
                 throw new RuntimeException("El código de cupón " + codigoGenerado + " ya existe en la base de datos. No se creó ningún cupón del lote.");
            }
            
            // 3. Mapear y configurar el cupón
            Cupon nuevoCupon = new Cupon();
            nuevoCupon.setCodigo(codigoGenerado); 
            
            nuevoCupon.setTipoDescuento(request.getTipoDescuento());
            nuevoCupon.setValor(request.getValor());
            nuevoCupon.setFechaExpiracion(request.getFechaExpiracion());
            
            // REQUISITO: Forzar el uso a 1 (si no es null, es 1, si es null, se usa el predeterminado)
            // Ya que el requisito anterior era uso único, lo forzamos a 1.
            nuevoCupon.setUsosMaximos(1); 
            
            nuevoCupon.setMontoMinimoRequerido(request.getMontoMinimoRequerido());
            
            nuevosCupones.add(nuevoCupon);
        }

        // 4. Guardar todos los cupones de forma eficiente
        List<Cupon> cuponesGuardados = cuponRepositorio.saveAll(nuevosCupones);
        
        // 5. Mapear a respuesta
        return cuponesGuardados.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // El método 'crearCupon(CrearCuponRequest request)' anterior fue ELIMINADO
    // si desea mantener la edición.
    
    // -------------------------------------------------------------------------
    // L E E R - Todos
    // -------------------------------------------------------------------------
    public List<CuponResponse> listarTodos() {
        return cuponRepositorio.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // ... (El resto de métodos: obtenerPorId, actualizarCupon, eliminarCupon) ...

    public CuponResponse obtenerPorId(Long id) {
        Cupon cupon = cuponRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado con ID: " + id));
        
        return mapToResponse(cupon);
    }

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

    public void eliminarCupon(Long id) {
        // Verificamos que exista para lanzar 404 en el controlador
        if (!cuponRepositorio.existsById(id)) {
            throw new RuntimeException("Cupón no encontrado con ID: " + id);
        }
        cuponRepositorio.deleteById(id);
    }
    
    // -------------------------------------------------------------------------
    // M A P E A D O R E S (Sin cambios, se usan los DTO y la Entidad)
    // -------------------------------------------------------------------------
    // Nota: El 'mapFromRequest' anterior fue eliminado/no se usa,
    // ya que la creación ahora es manual dentro del nuevo método de lote.
    
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