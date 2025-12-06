-- Script para insertar productos de prueba en la base de datos
-- Ejecutar este script en la base de datos db_ventas

-- Limpiar datos existentes (opcional)
-- DELETE FROM combo_productos;
-- DELETE FROM productos;

-- Insertar productos individuales
INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, descuento_total, informacion_adicional, imagen_url, activo, stock, created_at, updated_at, created_by)
VALUES
('PROD-0001', 'iPhone 15 Pro', 'EQUIPO_MOVIL', 999.99, 999.99, 0.00, '128GB, Color Negro', 'https://example.com/iphone15.jpg', TRUE, 50, NOW(), NOW(), 'admin'),
('PROD-0002', 'Samsung Galaxy S24', 'EQUIPO_MOVIL', 899.99, 899.99, 0.00, '256GB, Color Blanco', 'https://example.com/galaxy-s24.jpg', TRUE, 30, NOW(), NOW(), 'admin'),
('PROD-0003', 'Internet Fibra 200Mbps', 'SERVICIO_HOGAR', 49.99, 49.99, 0.00, 'Velocidad de descarga 200Mbps, carga 100Mbps', 'https://example.com/internet.jpg', TRUE, 100, NOW(), NOW(), 'admin'),
('PROD-0004', 'TV Cable Premium', 'SERVICIO_HOGAR', 39.99, 39.99, 0.00, 'Más de 200 canales HD', 'https://example.com/tv-cable.jpg', TRUE, 100, NOW(), NOW(), 'admin'),
('PROD-0005', 'Plan Postpago Ilimitado', 'SERVICIO_MOVIL', 29.99, 29.99, 0.00, 'Llamadas y SMS ilimitados, 20GB datos', 'https://example.com/plan-ilimitado.jpg', TRUE, 100, NOW(), NOW(), 'admin'),
('PROD-0006', 'Tablet Android 10"', 'EQUIPO_MOVIL', 299.99, 299.99, 0.00, '64GB, Pantalla Full HD', 'https://example.com/tablet.jpg', TRUE, 25, NOW(), NOW(), 'admin'),
('PROD-0007', 'Router WiFi 6', 'SERVICIO_HOGAR', 89.99, 89.99, 0.00, 'Dual Band, hasta 1200Mbps', 'https://example.com/router.jpg', TRUE, 40, NOW(), NOW(), 'admin'),
('PROD-0008', 'Smartwatch Pro', 'EQUIPO_MOVIL', 199.99, 199.99, 0.00, 'Monitor de salud, GPS integrado', 'https://example.com/smartwatch.jpg', TRUE, 35, NOW(), NOW(), 'admin');

-- Insertar un combo de ejemplo
INSERT INTO productos (codigo, nombre, tipo, precio_base, precio_final, descuento_total, informacion_adicional, imagen_url, activo, stock, created_at, updated_at, created_by)
VALUES
('COMBO-0001', 'Pack Conectividad Total', 'COMBO', 119.97, 99.99, 19.98, 'Internet + TV Cable + Plan Móvil', 'https://example.com/combo1.jpg', TRUE, 20, NOW(), NOW(), 'admin');

-- Insertar relaciones del combo (usar los IDs correctos según tu base de datos)
-- Nota: Ajusta los IDs según los generados en tu base de datos
INSERT INTO combo_productos (combo_id, producto_id, orden, precio_individual, descuento_aplicado, created_at)
SELECT
    (SELECT id FROM productos WHERE codigo = 'COMBO-0001'),
    p.id,
    ROW_NUMBER() OVER (ORDER BY p.id),
    p.precio_final,
    0.00,
    NOW()
FROM productos p
WHERE p.codigo IN ('PROD-0003', 'PROD-0004', 'PROD-0005');

-- Verificar los datos insertados
-- SELECT * FROM productos;
-- SELECT * FROM combo_productos;

