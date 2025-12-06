package com.venta.backend.producto.service;

import com.venta.backend.producto.dto.ComboDBRequest;
import com.venta.backend.producto.dto.ProductoDBDTO;
import com.venta.backend.producto.dto.ProductoDisponibleDTO;
import com.venta.backend.producto.entity.ComboProducto;
import com.venta.backend.producto.entity.Producto;
import com.venta.backend.producto.enums.TipoProducto;
import com.venta.backend.producto.repository.ComboProductoRepository;
import com.venta.backend.producto.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para manejar productos conectados a la base de datos
 */
@Service
@RequiredArgsConstructor
public class ProductoDBService {

    private final ProductoRepository productoRepository;
    private final ComboProductoRepository comboProductoRepository;

    /**
     * Obtiene productos disponibles para el frontend
     * Productos con activo=true y stock>0
     */
    @Transactional(readOnly = true)
    public List<ProductoDisponibleDTO> obtenerProductosDisponibles() {
        return productoRepository.findProductosDisponibles()
                .stream()
                .map(ProductoDisponibleDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los productos individuales (no combos)
     */
    @Transactional(readOnly = true)
    public List<Producto> obtenerProductosIndividuales() {
        return productoRepository.findAllProductosIndividuales();
    }

    /**
     * Obtiene todos los combos
     */
    @Transactional(readOnly = true)
    public List<Producto> obtenerCombos() {
        return productoRepository.findAllCombos();
    }

    /**
     * Obtiene un producto por ID
     */
    @Transactional(readOnly = true)
    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    /**
     * Obtiene productos de un combo
     */
    @Transactional(readOnly = true)
    public List<ComboProducto> obtenerProductosDeCombo(Long comboId) {
        return comboProductoRepository.findByComboId(comboId);
    }

    /**
     * Guarda un nuevo producto
     */
    @Transactional
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    /**
     * Guarda un combo con sus productos
     */
    @Transactional
    public Producto guardarCombo(Producto combo, List<Long> productosIds) {
        // Guardar el combo
        combo.setTipo(TipoProducto.COMBO);
        Producto comboGuardado = productoRepository.save(combo);

        // Guardar la relación con los productos
        for (int i = 0; i < productosIds.size(); i++) {
            Long productoId = productosIds.get(i);
            Producto producto = obtenerProductoPorId(productoId);

            ComboProducto comboProducto = ComboProducto.builder()
                    .comboId(comboGuardado.getId())
                    .productoId(productoId)
                    .orden(i + 1)
                    .precioIndividual(producto.getPrecioFinal())
                    .descuentoAplicado(BigDecimal.ZERO)
                    .build();

            comboProductoRepository.save(comboProducto);
        }

        return comboGuardado;
    }

    /**
     * Filtra productos por tipo
     */
    @Transactional(readOnly = true)
    public List<Producto> obtenerProductosPorTipo(TipoProducto tipo) {
        return productoRepository.findByTipoAndActivoTrue(tipo);
    }

    /**
     * Busca producto por código
     */
    @Transactional(readOnly = true)
    public Producto buscarPorCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con código: " + codigo));
    }

    /**
     * Obtiene productos individuales como ProductoDBDTO para el frontend admin
     */
    @Transactional(readOnly = true)
    public List<ProductoDBDTO> obtenerProductosIndividualesDTO() {
        return productoRepository.findAllProductosIndividuales()
                .stream()
                .map(ProductoDBDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los combos como ProductoDBDTO
     */
    @Transactional(readOnly = true)
    public List<ProductoDBDTO> obtenerCombosDTO() {
        return productoRepository.findAllCombos()
                .stream()
                .map(this::convertirComboADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el detalle de un combo incluyendo sus productos
     */
    @Transactional(readOnly = true)
    public ProductoDBDTO obtenerDetalleComboDTO(Long comboId) {
        Producto combo = obtenerProductoPorId(comboId);
        if (combo.getTipo() != TipoProducto.COMBO) {
            throw new RuntimeException("El producto con ID " + comboId + " no es un combo");
        }
        return convertirComboADTO(combo);
    }

    /**
     * Crea un nuevo combo aplicando descuentos
     */
    @Transactional
    public ProductoDBDTO crearCombo(ComboDBRequest request) {
        // Obtener los productos seleccionados
        List<Producto> productosSeleccionados = request.getProductosIds().stream()
                .map(this::obtenerProductoPorId)
                .collect(Collectors.toList());

        // Validar que todos los productos tengan stock disponible
        for (Producto producto : productosSeleccionados) {
            if (producto.getStock() <= 0) {
                throw new RuntimeException("El producto '" + producto.getNombre() + "' no tiene stock disponible");
            }
        }

        // Calcular precios
        BigDecimal precioBaseTotal = productosSeleccionados.stream()
                .map(Producto::getPrecioBase)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aplicar descuentos: 15% a equipos móviles, 10% a servicios
        BigDecimal precioFinalTotal = BigDecimal.ZERO;
        BigDecimal descuentoTotal = BigDecimal.ZERO;

        for (Producto producto : productosSeleccionados) {
            BigDecimal precioConDescuento;
            if (producto.getTipo() == TipoProducto.EQUIPO_MOVIL) {
                precioConDescuento = producto.getPrecioBase().multiply(BigDecimal.valueOf(0.85)); // 15% descuento
                descuentoTotal = descuentoTotal.add(producto.getPrecioBase().multiply(BigDecimal.valueOf(0.15)));
            } else {
                precioConDescuento = producto.getPrecioBase().multiply(BigDecimal.valueOf(0.90)); // 10% descuento
                descuentoTotal = descuentoTotal.add(producto.getPrecioBase().multiply(BigDecimal.valueOf(0.10)));
            }
            precioFinalTotal = precioFinalTotal.add(precioConDescuento);
        }

        // Generar código único para el combo
        String codigoCombo = "COMBO-" + System.currentTimeMillis();

        // Crear el combo
        Producto combo = Producto.builder()
                .codigo(codigoCombo)
                .nombre(request.getNombre())
                .tipo(TipoProducto.COMBO)
                .precioBase(precioBaseTotal)
                .precioFinal(precioFinalTotal)
                .descuentoTotal(descuentoTotal)
                .informacionAdicional("Combo de " + productosSeleccionados.size() + " productos")
                .activo(true)
                .stock(1)
                .build();

        // Descontar stock de los productos componentes
        for (Producto producto : productosSeleccionados) {
            producto.setStock(producto.getStock() - 1);
            productoRepository.save(producto);
        }

        // Guardar el combo con sus productos
        Producto comboGuardado = guardarCombo(combo, request.getProductosIds());

        // Retornar el DTO con los productos componentes
        return convertirComboADTO(comboGuardado);
    }

    /**
     * Convierte un Producto combo a ProductoDBDTO incluyendo sus componentes
     */
    private ProductoDBDTO convertirComboADTO(Producto combo) {
        // Obtener los productos que componen el combo
        List<ComboProducto> comboProductos = comboProductoRepository.findByComboId(combo.getId());
        List<ProductoDBDTO> componentes = comboProductos.stream()
                .map(cp -> {
                    Producto producto = obtenerProductoPorId(cp.getProductoId());
                    return ProductoDBDTO.fromEntity(producto);
                })
                .collect(Collectors.toList());

        // Construir el DTO con todos los campos incluyendo componentes
        return ProductoDBDTO.builder()
                .id(combo.getId())
                .codigo(combo.getCodigo())
                .nombre(combo.getNombre())
                .tipo(combo.getTipo())
                .precioBase(combo.getPrecioBase())
                .precioFinal(combo.getPrecioFinal())
                .informacionAdicional(combo.getInformacionAdicional())
                .descuentoTotal(combo.getDescuentoTotal())
                .imagenUrl(combo.getImagenUrl())
                .componentes(componentes)
                .build();
    }
}
