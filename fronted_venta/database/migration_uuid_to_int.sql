-- ============================================================================
-- SCRIPT DE MIGRACIÓN: Convertir IDs UUID a INT AUTO_INCREMENT
-- ============================================================================
-- Este script modifica la estructura existente para usar IDs autoincrementales
-- y códigos cortos (PROD-0001, COMBO-0001)
-- ============================================================================

USE mod_ventas;

-- ============================================================================
-- PASO 1: Crear tabla temporal para productos con nueva estructura
-- ============================================================================

CREATE TABLE productos_new (
    -- Identificación
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID autoincremental del producto',
    codigo VARCHAR(20) UNIQUE NOT NULL COMMENT 'Código del producto (PROD-0001, COMBO-0001)',
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre del producto o combo',
    
    -- Tipo de producto
    tipo ENUM('EQUIPO_MOVIL', 'SERVICIO_HOGAR', 'SERVICIO_MOVIL', 'COMBO') NOT NULL 
        COMMENT 'Tipo de producto',
    
    -- Precios
    precio_base DECIMAL(10,2) NOT NULL COMMENT 'Precio original sin descuentos',
    precio_final DECIMAL(10,2) NOT NULL COMMENT 'Precio con descuentos aplicados',
    descuento_total DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Total de descuentos aplicados',
    
    -- Información adicional
    informacion_adicional TEXT COMMENT 'Detalles técnicos o características',
    imagen_url VARCHAR(500) COMMENT 'URL de la imagen del producto',
    
    -- Estado y disponibilidad
    activo BOOLEAN DEFAULT TRUE COMMENT 'Si el producto está disponible para venta',
    stock INT DEFAULT 0 COMMENT 'Cantidad disponible (para equipos)',
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización',
    created_by VARCHAR(100) COMMENT 'Usuario que creó el registro',
    
    -- Índices
    INDEX idx_codigo (codigo),
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- PASO 2: Migrar datos de productos a la nueva tabla
-- ============================================================================

-- Generar códigos automáticos según el tipo
SET @prod_counter = 0;
SET @combo_counter = 0;

INSERT INTO productos_new (
    codigo, 
    nombre, 
    tipo, 
    precio_base, 
    precio_final, 
    descuento_total, 
    informacion_adicional, 
    imagen_url, 
    activo, 
    stock,
    created_at,
    updated_at,
    created_by
)
SELECT 
    CASE 
        WHEN tipo = 'COMBO' THEN 
            CONCAT('COMBO-', LPAD(
                (@combo_counter := @combo_counter + 1), 4, '0'
            ))
        ELSE 
            CONCAT('PROD-', LPAD(
                (@prod_counter := @prod_counter + 1), 4, '0'
            ))
    END AS codigo,
    nombre,
    tipo,
    precio_base,
    precio_final,
    COALESCE(descuento_total, 0.00) AS descuento_total,
    informacion_adicional,
    imagen_url,
    COALESCE(activo, TRUE) AS activo,
    COALESCE(stock, 0) AS stock,
    COALESCE(created_at, CURRENT_TIMESTAMP) AS created_at,
    COALESCE(updated_at, CURRENT_TIMESTAMP) AS updated_at,
    created_by
FROM productos
ORDER BY 
    CASE WHEN tipo = 'COMBO' THEN 1 ELSE 0 END,  -- Combos al final
    created_at;


-- ============================================================================
-- PASO 3: Crear tabla de mapeo UUID -> INT ID
-- ============================================================================

CREATE TEMPORARY TABLE id_mapping (
    old_uuid VARCHAR(36),
    new_id INT,
    new_codigo VARCHAR(20),
    tipo VARCHAR(20),
    PRIMARY KEY (old_uuid),
    INDEX idx_new_id (new_id)
);

-- Llenar tabla de mapeo
INSERT INTO id_mapping (old_uuid, new_id, new_codigo, tipo)
SELECT 
    p_old.id AS old_uuid,
    p_new.id AS new_id,
    p_new.codigo AS new_codigo,
    p_new.tipo
FROM productos p_old
INNER JOIN productos_new p_new ON p_old.nombre = p_new.nombre AND p_old.tipo = p_new.tipo
ORDER BY p_old.created_at;


-- ============================================================================
-- PASO 4: Crear nueva tabla combo_productos
-- ============================================================================

CREATE TABLE combo_productos_new (
    combo_id INT NOT NULL COMMENT 'ID del combo',
    producto_id INT NOT NULL COMMENT 'ID del producto componente',
    orden INT DEFAULT 0 COMMENT 'Orden de presentación en el combo',
    precio_individual DECIMAL(10,2) COMMENT 'Precio del producto al momento de agregar al combo',
    descuento_aplicado DECIMAL(5,2) COMMENT 'Porcentaje de descuento aplicado (15% o 10%)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de asociación',
    
    PRIMARY KEY (combo_id, producto_id),
    
    CONSTRAINT fk_combo_new 
        FOREIGN KEY (combo_id) REFERENCES productos_new(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_producto_componente_new 
        FOREIGN KEY (producto_id) REFERENCES productos_new(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_descuento_valido_new 
        CHECK (descuento_aplicado >= 0 AND descuento_aplicado <= 100),
    CONSTRAINT chk_precio_positivo_new 
        CHECK (precio_individual >= 0),
    
    INDEX idx_combo_id_new (combo_id),
    INDEX idx_producto_id_new (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- PASO 5: Migrar relaciones combo_productos
-- ============================================================================

INSERT INTO combo_productos_new (combo_id, producto_id, orden, precio_individual, descuento_aplicado, created_at)
SELECT 
    m_combo.new_id AS combo_id,
    m_prod.new_id AS producto_id,
    cp.orden,
    cp.precio_individual,
    cp.descuento_aplicado,
    cp.created_at
FROM combo_productos cp
INNER JOIN id_mapping m_combo ON cp.combo_id = m_combo.old_uuid
INNER JOIN id_mapping m_prod ON cp.producto_id = m_prod.old_uuid;


-- ============================================================================
-- PASO 6: Respaldar tablas antiguas y renombrar las nuevas
-- ============================================================================

-- Respaldar tablas antiguas (por seguridad)
RENAME TABLE combo_productos TO combo_productos_backup_old;
RENAME TABLE productos TO productos_backup_old;

-- Activar las nuevas tablas
RENAME TABLE productos_new TO productos;
RENAME TABLE combo_productos_new TO combo_productos;


-- ============================================================================
-- PASO 7: Recrear vistas con la nueva estructura
-- ============================================================================

-- Vista: Productos disponibles
DROP VIEW IF EXISTS v_productos_disponibles;
CREATE VIEW v_productos_disponibles AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.tipo,
    p.precio_base,
    p.precio_final,
    p.informacion_adicional,
    p.imagen_url,
    p.stock,
    p.activo
FROM productos p
WHERE p.tipo != 'COMBO' 
  AND p.activo = TRUE
ORDER BY p.tipo, p.nombre;


-- Vista: Detalle completo de combos
DROP VIEW IF EXISTS v_combos_detalle;
CREATE VIEW v_combos_detalle AS
SELECT 
    c.id AS combo_id,
    c.codigo AS combo_codigo,
    c.nombre AS combo_nombre,
    c.precio_base AS combo_precio_base,
    c.precio_final AS combo_precio_final,
    c.descuento_total AS combo_descuento,
    c.imagen_url AS combo_imagen,
    p.id AS producto_id,
    p.codigo AS producto_codigo,
    p.nombre AS producto_nombre,
    p.tipo AS producto_tipo,
    cp.precio_individual,
    cp.descuento_aplicado,
    cp.orden,
    (cp.precio_individual * cp.descuento_aplicado / 100) AS ahorro_individual
FROM productos c
INNER JOIN combo_productos cp ON c.id = cp.combo_id
INNER JOIN productos p ON cp.producto_id = p.id
WHERE c.tipo = 'COMBO'
  AND c.activo = TRUE
ORDER BY c.nombre, cp.orden;


-- Vista: Lista de combos activos
DROP VIEW IF EXISTS v_combos_activos;
CREATE VIEW v_combos_activos AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.precio_base,
    p.precio_final,
    p.descuento_total,
    p.informacion_adicional,
    p.imagen_url,
    p.created_at,
    COUNT(cp.producto_id) AS cantidad_productos
FROM productos p
LEFT JOIN combo_productos cp ON p.id = cp.combo_id
WHERE p.tipo = 'COMBO' 
  AND p.activo = TRUE
GROUP BY p.id, p.codigo, p.nombre, p.precio_base, p.precio_final, p.descuento_total, 
         p.informacion_adicional, p.imagen_url, p.created_at
ORDER BY p.created_at DESC;


-- ============================================================================
-- PASO 8: Recrear stored procedures y funciones
-- ============================================================================

DROP PROCEDURE IF EXISTS sp_crear_combo;
DROP PROCEDURE IF EXISTS sp_obtener_combo_detalle;
DROP FUNCTION IF EXISTS fn_calcular_precio_combo;
DROP FUNCTION IF EXISTS fn_producto_en_combo;

DELIMITER //

-- Procedimiento: Crear combo con descuentos automáticos
CREATE PROCEDURE sp_crear_combo(
    IN p_combo_nombre VARCHAR(255),
    IN p_productos_ids JSON,
    OUT p_combo_id INT,
    OUT p_combo_codigo VARCHAR(20),
    OUT p_precio_base DECIMAL(10,2),
    OUT p_precio_final DECIMAL(10,2),
    OUT p_descuento_total DECIMAL(10,2)
)
BEGIN
    DECLARE v_producto_id INT;
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_descuento DECIMAL(5,2);
    DECLARE v_precio_con_descuento DECIMAL(10,2);
    DECLARE v_contador INT DEFAULT 0;
    DECLARE v_total INT;
    DECLARE v_next_combo_num INT;
    
    SET p_precio_base = 0;
    SET p_precio_final = 0;
    SET p_descuento_total = 0;
    
    -- Obtener el siguiente número de combo
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo, 7) AS UNSIGNED)), 0) + 1 
    INTO v_next_combo_num
    FROM productos 
    WHERE tipo = 'COMBO' AND codigo LIKE 'COMBO-%';
    
    SET p_combo_codigo = CONCAT('COMBO-', LPAD(v_next_combo_num, 4, '0'));
    SET v_total = JSON_LENGTH(p_productos_ids);
    
    -- Iterar productos y calcular precios
    WHILE v_contador < v_total DO
        SET v_producto_id = JSON_UNQUOTE(JSON_EXTRACT(p_productos_ids, CONCAT('$[', v_contador, ']')));
        
        SELECT tipo, precio_base INTO v_tipo, v_precio
        FROM productos
        WHERE id = v_producto_id;
        
        IF v_tipo = 'EQUIPO_MOVIL' THEN
            SET v_descuento = 15.00;
        ELSE
            SET v_descuento = 10.00;
        END IF;
        
        SET v_precio_con_descuento = v_precio * (1 - v_descuento / 100);
        SET p_precio_base = p_precio_base + v_precio;
        SET p_precio_final = p_precio_final + v_precio_con_descuento;
        
        SET v_contador = v_contador + 1;
    END WHILE;
    
    SET p_descuento_total = p_precio_base - p_precio_final;
    
    -- Insertar el combo
    INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, descuento_total, activo)
    VALUES (p_combo_codigo, p_combo_nombre, 'COMBO', p_precio_base, p_precio_final, p_descuento_total, TRUE);
    
    SET p_combo_id = LAST_INSERT_ID();
    SET v_contador = 0;
    
    -- Insertar relaciones
    WHILE v_contador < v_total DO
        SET v_producto_id = JSON_UNQUOTE(JSON_EXTRACT(p_productos_ids, CONCAT('$[', v_contador, ']')));
        
        SELECT tipo, precio_base INTO v_tipo, v_precio
        FROM productos
        WHERE id = v_producto_id;
        
        IF v_tipo = 'EQUIPO_MOVIL' THEN
            SET v_descuento = 15.00;
        ELSE
            SET v_descuento = 10.00;
        END IF;
        
        INSERT INTO combo_productos (combo_id, producto_id, orden, precio_individual, descuento_aplicado)
        VALUES (p_combo_id, v_producto_id, v_contador + 1, v_precio, v_descuento);
        
        SET v_contador = v_contador + 1;
    END WHILE;
END //


-- Procedimiento: Obtener detalle de un combo
CREATE PROCEDURE sp_obtener_combo_detalle(IN p_combo_id INT)
BEGIN
    SELECT id, codigo, nombre, tipo, precio_base, precio_final, descuento_total, 
           informacion_adicional, imagen_url, created_at
    FROM productos
    WHERE id = p_combo_id AND tipo = 'COMBO';
    
    SELECT p.id, p.codigo, p.nombre, p.tipo, cp.precio_individual, cp.descuento_aplicado,
           (cp.precio_individual * (1 - cp.descuento_aplicado / 100)) AS precio_con_descuento,
           (cp.precio_individual * cp.descuento_aplicado / 100) AS ahorro,
           p.imagen_url, cp.orden
    FROM combo_productos cp
    INNER JOIN productos p ON cp.producto_id = p.id
    WHERE cp.combo_id = p_combo_id
    ORDER BY cp.orden;
END //


-- Funciones
CREATE FUNCTION fn_calcular_precio_combo(p_combo_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    SELECT SUM(cp.precio_individual * (1 - cp.descuento_aplicado / 100)) INTO v_total
    FROM combo_productos cp
    WHERE cp.combo_id = p_combo_id;
    RETURN IFNULL(v_total, 0);
END //


CREATE FUNCTION fn_producto_en_combo(p_producto_id INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count FROM combo_productos WHERE producto_id = p_producto_id;
    RETURN v_count > 0;
END //

DELIMITER ;


-- ============================================================================
-- PASO 9: Recrear triggers
-- ============================================================================

DROP TRIGGER IF EXISTS trg_validar_producto_en_combo;
DROP TRIGGER IF EXISTS trg_productos_updated_at;

DELIMITER //

CREATE TRIGGER trg_validar_producto_en_combo
BEFORE INSERT ON combo_productos
FOR EACH ROW
BEGIN
    DECLARE v_tipo VARCHAR(20);
    SELECT tipo INTO v_tipo FROM productos WHERE id = NEW.producto_id;
    IF v_tipo = 'COMBO' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede agregar un combo como componente de otro combo';
    END IF;
END //

CREATE TRIGGER trg_productos_updated_at
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;


-- ============================================================================
-- PASO 10: Recrear índices adicionales
-- ============================================================================

CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_tipo_activo ON productos(tipo, activo);
CREATE INDEX idx_productos_created_at_desc ON productos(created_at DESC);
CREATE INDEX idx_productos_codigo_tipo ON productos(codigo, tipo);


-- ============================================================================
-- VERIFICACIÓN: Comprobar la migración
-- ============================================================================

-- Mostrar estadísticas
SELECT 'Migración completada exitosamente!' AS Status;

SELECT 
    'Productos migrados' AS Tipo,
    COUNT(*) AS Total
FROM productos
WHERE tipo != 'COMBO'
UNION ALL
SELECT 
    'Combos migrados' AS Tipo,
    COUNT(*) AS Total
FROM productos
WHERE tipo = 'COMBO'
UNION ALL
SELECT 
    'Relaciones combo-producto' AS Tipo,
    COUNT(*) AS Total
FROM combo_productos;

-- Mostrar ejemplos de códigos generados
SELECT id, codigo, nombre, tipo, precio_base, precio_final
FROM productos
ORDER BY id
LIMIT 10;

-- Verificar mapeo (temporal table se borrará al cerrar conexión)
SELECT * FROM id_mapping LIMIT 10;


-- ============================================================================
-- LIMPIEZA (OPCIONAL): Eliminar tablas de respaldo después de verificar
-- ============================================================================
-- ⚠️ SOLO EJECUTAR DESPUÉS DE VERIFICAR QUE TODO FUNCIONA CORRECTAMENTE

-- DROP TABLE IF EXISTS productos_backup_old;
-- DROP TABLE IF EXISTS combo_productos_backup_old;


-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================
