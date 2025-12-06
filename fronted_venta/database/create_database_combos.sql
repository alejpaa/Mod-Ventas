-- ============================================================================
-- SCRIPT SQL COMPLETO PARA SISTEMA DE COMBOS - MySQL
-- ============================================================================
-- Base de datos: mod_ventas
-- Autor: Sistema de Gestión de Ventas
-- Fecha: Diciembre 2025
-- Descripción: Estructura completa para productos, combos y gestión de imágenes
-- ============================================================================

-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS mod_ventas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE mod_ventas;

-- ============================================================================
-- TABLA: productos
-- Descripción: Almacena todos los productos (equipos, servicios y combos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS productos (
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
    
    -- Índices para búsquedas
    INDEX idx_codigo (codigo),
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabla principal de productos y combos';


-- ============================================================================
-- TABLA: combo_productos
-- Descripción: Relación muchos-a-muchos entre combos y sus productos componentes
-- ============================================================================

CREATE TABLE IF NOT EXISTS combo_productos (
    -- Identificadores
    combo_id INT NOT NULL COMMENT 'ID del combo',
    producto_id INT NOT NULL COMMENT 'ID del producto componente',
    
    -- Información adicional
    orden INT DEFAULT 0 COMMENT 'Orden de presentación en el combo',
    precio_individual DECIMAL(10,2) COMMENT 'Precio del producto al momento de agregar al combo',
    descuento_aplicado DECIMAL(5,2) COMMENT 'Porcentaje de descuento aplicado (15% o 10%)',
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de asociación',
    
    -- Clave primaria compuesta
    PRIMARY KEY (combo_id, producto_id),
    
    -- Claves foráneas
    CONSTRAINT fk_combo 
        FOREIGN KEY (combo_id) REFERENCES productos(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_producto_componente 
        FOREIGN KEY (producto_id) REFERENCES productos(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    -- Validaciones
    CONSTRAINT chk_descuento_valido 
        CHECK (descuento_aplicado >= 0 AND descuento_aplicado <= 100),
    CONSTRAINT chk_precio_positivo 
        CHECK (precio_individual >= 0),
    
    -- Índices
    INDEX idx_combo_id (combo_id),
    INDEX idx_producto_id (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Relación entre combos y sus productos componentes';


-- ============================================================================
-- DATOS DE EJEMPLO: Productos Base
-- ============================================================================

-- Insertar Equipos Móviles
INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, informacion_adicional, imagen_url, activo, stock) VALUES
('PROD-0001', 'Smartphone X20', 'EQUIPO_MOVIL', 1200.00, 1200.00, 
    '256GB, 8GB RAM, Cámara 48MP, Pantalla AMOLED 6.5"', 
    'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Smartphone+X20', TRUE, 50),

('PROD-0002', 'iPhone 14 Pro', 'EQUIPO_MOVIL', 4500.00, 4500.00, 
    '512GB, Triple cámara, Pantalla Super Retina 6.7"', 
    'https://via.placeholder.com/300x200/4F46E5/ffffff?text=iPhone+14+Pro', TRUE, 30),

('PROD-0003', 'Samsung Galaxy S23', 'EQUIPO_MOVIL', 3800.00, 3800.00, 
    '256GB, Snapdragon 8 Gen 2, Cámara 50MP', 
    'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Galaxy+S23', TRUE, 40);

-- Insertar Servicios de Hogar
INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, informacion_adicional, imagen_url, activo) VALUES
('PROD-0004', 'Internet 100Mbps', 'SERVICIO_HOGAR', 99.99, 99.99, 
    'Fibra óptica, instalación incluida, router WiFi 6', 
    'https://via.placeholder.com/300x200/10B981/ffffff?text=Internet+100Mbps', TRUE),

('PROD-0005', 'Internet 300Mbps', 'SERVICIO_HOGAR', 149.99, 149.99, 
    'Fibra óptica ultra rápida, router mesh incluido', 
    'https://via.placeholder.com/300x200/10B981/ffffff?text=Internet+300Mbps', TRUE),

('PROD-0006', 'TV Cable Premium', 'SERVICIO_HOGAR', 60.00, 60.00, 
    '200+ canales HD, incluye HBO y ESPN', 
    'https://via.placeholder.com/300x200/10B981/ffffff?text=TV+Cable+Premium', TRUE);

-- Insertar Servicios Móviles
INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, informacion_adicional, imagen_url, activo) VALUES
('PROD-0007', 'Plan Postpago Ilimitado', 'SERVICIO_MOVIL', 49.50, 49.50, 
    'Llamadas y SMS ilimitados, 10GB datos', 
    'https://via.placeholder.com/300x200/10B981/ffffff?text=Plan+Ilimitado', TRUE),

('PROD-0008', 'Plan Max 20GB', 'SERVICIO_MOVIL', 79.99, 79.99, 
    'Llamadas ilimitadas, 20GB datos + redes sociales gratis', 
    'https://via.placeholder.com/300x200/10B981/ffffff?text=Plan+Max+20GB', TRUE),

('PROD-0009', 'Plan Familia 50GB', 'SERVICIO_MOVIL', 129.99, 129.99, 
    '3 líneas compartidas, 50GB totales', 
    'https://via.placeholder.com/300x200/10B981/ffffff?text=Plan+Familia', TRUE);


-- ============================================================================
-- EJEMPLO: Crear un Combo con Descuentos
-- ============================================================================

-- Insertar el combo principal
INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, descuento_total, informacion_adicional, imagen_url, activo)
VALUES (
    'COMBO-0001',
    'Súper Pack Hogar y Móvil',
    'COMBO',
    1349.49,  -- Suma: 1200 (smartphone) + 99.99 (internet) + 49.50 (plan)
    1239.49,  -- Con descuentos: 1020 (smartphone -15%) + 89.99 (internet -10%) + 44.55 (plan -10%)
    110.00,   -- Ahorro total
    'Combo completo con smartphone, internet y plan móvil. Ahorro de S/ 110.00',
    'https://via.placeholder.com/300x200/8B5CF6/ffffff?text=Combo+Pack',
    TRUE
);

-- Asociar productos al combo con sus descuentos (usando IDs autoincrementales)
INSERT INTO combo_productos (combo_id, producto_id, orden, precio_individual, descuento_aplicado) VALUES
(10, 1, 1, 1200.00, 15.00), -- Smartphone X20 (-15%)
(10, 4, 2, 99.99, 10.00),   -- Internet 100Mbps (-10%)
(10, 7, 3, 49.50, 10.00);   -- Plan Postpago (-10%)


-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista: Productos disponibles (no combos)
CREATE OR REPLACE VIEW v_productos_disponibles AS
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
CREATE OR REPLACE VIEW v_combos_detalle AS
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
CREATE OR REPLACE VIEW v_combos_activos AS
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
GROUP BY p.id, p.nombre, p.precio_base, p.precio_final, p.descuento_total, 
         p.informacion_adicional, p.imagen_url, p.created_at
ORDER BY p.created_at DESC;


-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================
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
    
    -- Inicializar variables
    SET p_precio_base = 0;
    SET p_precio_final = 0;
    SET p_descuento_total = 0;
    
    -- Obtener el siguiente número de combo
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo, 7) AS UNSIGNED)), 0) + 1 
    INTO v_next_combo_num
    FROM productos 
    WHERE tipo = 'COMBO' AND codigo LIKE 'COMBO-%';
    
    -- Generar código del combo
    SET p_combo_codigo = CONCAT('COMBO-', LPAD(v_next_combo_num, 4, '0'));
    
    -- Obtener cantidad de productos
    SET v_total = JSON_LENGTH(p_productos_ids);
    
    -- Iterar sobre cada producto
    WHILE v_contador < v_total DO
        -- Obtener ID del producto
        SET v_producto_id = JSON_UNQUOTE(JSON_EXTRACT(p_productos_ids, CONCAT('$[', v_contador, ']')));
        
        -- Obtener tipo y precio del producto
        SELECT tipo, precio_base INTO v_tipo, v_precio
        FROM productos
        WHERE id = v_producto_id;
        
        -- Determinar descuento según tipo
        IF v_tipo = 'EQUIPO_MOVIL' THEN
            SET v_descuento = 15.00;
        ELSE
            SET v_descuento = 10.00;
        END IF;
        
        -- Calcular precio con descuento
        SET v_precio_con_descuento = v_precio * (1 - v_descuento / 100);
        
        -- Acumular totales
        SET p_precio_base = p_precio_base + v_precio;
        SET p_precio_final = p_precio_final + v_precio_con_descuento;
        
        SET v_contador = v_contador + 1;
    END WHILE;
    
    -- Calcular descuento total
    SET p_descuento_total = p_precio_base - p_precio_final;
    
    -- Insertar el combo
-- Procedimiento: Obtener detalle de un combo
CREATE PROCEDURE sp_obtener_combo_detalle(
    IN p_combo_id INT
)
BEGIN
    -- Información del combo
    SELECT 
        id,
        codigo,
        nombre,
        tipo,
        precio_base,
        precio_final,
        descuento_total,
        informacion_adicional,
        imagen_url,
        created_at
    FROM productos
    WHERE id = p_combo_id AND tipo = 'COMBO';
    
    -- Productos componentes
    SELECT 
        p.id,
        p.codigo,
        p.nombre,
        p.tipo,
        cp.precio_individual,
        cp.descuento_aplicado,
        (cp.precio_individual * (1 - cp.descuento_aplicado / 100)) AS precio_con_descuento,
        (cp.precio_individual * cp.descuento_aplicado / 100) AS ahorro,
        p.imagen_url,
        cp.orden
    FROM combo_productos cp
    INNER JOIN productos p ON cp.producto_id = p.id
    WHERE cp.combo_id = p_combo_id
    ORDER BY cp.orden;
END //cedimiento: Obtener detalle de un combo
CREATE PROCEDURE sp_obtener_combo_detalle(
    IN p_combo_id VARCHAR(36)
)
BEGIN
    -- Información del combo
    SELECT 
        id,
        nombre,
        tipo,
-- Función: Calcular precio de combo con descuentos
CREATE FUNCTION fn_calcular_precio_combo(p_combo_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    
    SELECT SUM(
        cp.precio_individual * (1 - cp.descuento_aplicado / 100)
    ) INTO v_total
    FROM combo_productos cp
    WHERE cp.combo_id = p_combo_id;
    
    RETURN IFNULL(v_total, 0);
END //


-- Función: Verificar si un producto está en algún combo
CREATE FUNCTION fn_producto_en_combo(p_producto_id INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM combo_productos
    WHERE producto_id = p_producto_id;
    
    RETURN v_count > 0;
END //=========================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

DELIMITER //

-- Función: Calcular precio de combo con descuentos
CREATE FUNCTION fn_calcular_precio_combo(p_combo_id VARCHAR(36))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    
    SELECT SUM(
        cp.precio_individual * (1 - cp.descuento_aplicado / 100)
    ) INTO v_total
    FROM combo_productos cp
    WHERE cp.combo_id = p_combo_id;
    
    RETURN IFNULL(v_total, 0);
END //


-- Función: Verificar si un producto está en algún combo
CREATE FUNCTION fn_producto_en_combo(p_producto_id VARCHAR(36))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM combo_productos
    WHERE producto_id = p_producto_id;
    
    RETURN v_count > 0;
END //

DELIMITER ;


-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Índice para búsqueda por nombre
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Índice compuesto para filtros comunes
CREATE INDEX idx_productos_tipo_activo ON productos(tipo, activo);

-- Índice para ordenar por fecha
CREATE INDEX idx_productos_created_at_desc ON productos(created_at DESC);

-- Índice para búsqueda por código
CREATE INDEX idx_productos_codigo_tipo ON productos(codigo, tipo);
    
    SELECT tipo INTO v_tipo
    FROM productos
    WHERE id = NEW.producto_id;
    
    IF v_tipo = 'COMBO' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede agregar un combo como componente de otro combo';
    END IF;
END //


-- Trigger: Actualizar fecha de modificación
CREATE TRIGGER trg_productos_updated_at
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;


-- ============================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índice para búsqueda de combos por nombre
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Índice compuesto para filtros comunes
CREATE INDEX idx_productos_tipo_activo ON productos(tipo, activo);

-- Índice para ordenar por fecha
CREATE INDEX idx_productos_created_at_desc ON productos(created_at DESC);


-- ============================================================================
-- CONSULTAS DE EJEMPLO
-- ============================================================================

-- 1. Listar todos los productos disponibles (excepto combos)
-- 3. Ver detalle completo de un combo específico
-- CALL sp_obtener_combo_detalle(10);

-- 4. Crear un nuevo combo (ejemplo)
/*
SET @combo_id = 0, @combo_codigo = '', @precio_base = 0, @precio_final = 0, @descuento = 0;
CALL sp_crear_combo(
    'Combo Premium 2024',
    '[1, 4]',
    @combo_id,
    @combo_codigo,
    @precio_base,
    @precio_final,
    @descuento
);
SELECT @combo_id AS id, @combo_codigo AS codigo, @precio_base, @precio_final, @descuento;
*/

-- 5. Ver todos los productos de un combo
/*
SELECT * FROM v_combos_detalle 
WHERE combo_id = 10
ORDER BY orden;
*/ 5. Ver todos los productos de un combo
/*
SELECT * FROM v_combos_detalle 
WHERE combo_id = 'combo-001-2024-12-05'
ORDER BY orden;
*/

-- 6. Estadísticas de combos
/*
SELECT 
    COUNT(*) AS total_combos,
    AVG(precio_base) AS precio_base_promedio,
    AVG(descuento_total) AS descuento_promedio,
    SUM(descuento_total) AS descuento_total_acumulado
FROM productos
WHERE tipo = 'COMBO' AND activo = TRUE;
*/


-- ============================================================================
-- PERMISOS Y SEGURIDAD (Opcional)
-- ============================================================================

-- Crear usuario específico para la aplicación
-- CREATE USER 'mod_ventas_app'@'localhost' IDENTIFIED BY 'tu_password_seguro';

-- Otorgar permisos
-- GRANT SELECT, INSERT, UPDATE ON mod_ventas.productos TO 'mod_ventas_app'@'localhost';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON mod_ventas.combo_productos TO 'mod_ventas_app'@'localhost';
-- GRANT EXECUTE ON PROCEDURE mod_ventas.sp_crear_combo TO 'mod_ventas_app'@'localhost';
-- GRANT EXECUTE ON PROCEDURE mod_ventas.sp_obtener_combo_detalle TO 'mod_ventas_app'@'localhost';
-- FLUSH PRIVILEGES;


-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

-- Verificar la estructura creada
SHOW TABLES;
SELECT COUNT(*) AS total_productos FROM productos;
SELECT COUNT(*) AS total_combos FROM productos WHERE tipo = 'COMBO';
SELECT * FROM v_productos_disponibles LIMIT 5;
