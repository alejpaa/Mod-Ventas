/**
 * TETRIS RETRO BACKEND - FINAL FIX
 * Solución definitiva al error de módulo
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

// Imports de Configuración
const config = require('./config/config');
const logger = require('./utils/logger');

// CORRECCIÓN AQUÍ: Buscamos 'security' a secas (que es como se llama el archivo)
const security = require('./middleware/security'); 

const apiRoutes = require('./routes/apiRoutes');
const db = require('./config/db');

const app = express();

// --- 1. Middlewares ---
app.use(cors()); 
app.use(express.json({ limit: '50kb' })); 
// Usamos la función de headers seguros
app.use(security.secureHeaders); 

// Logger
app.use((req, res, next) => {
    logger.info('HTTP', `${req.method} ${req.originalUrl} [IP: ${req.ip}]`);
    next();
});

// --- 2. Archivos Estáticos ---
app.use(express.static(path.join(__dirname, '../frontend')));

// --- 3. Rutas API ---
app.use('/api', apiRoutes);

// --- 4. Error 404 ---
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// --- 5. FUNCIÓN AUTO-ADMIN ---
async function createAdminUser() {
    try {
        const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', ['admin']);
        if (rows.length === 0) {
            console.log('⚙️  Creando usuario ADMIN...');
            const hash = await bcrypt.hash('admin', 10);
            const [res] = await db.execute(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)', 
                ['admin', hash]
            );
            // Configuración por defecto
            const defaultKeys = { left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown', rot: 'ArrowUp', drop: 'Space', hold: 'KeyC' };
            await db.execute('INSERT INTO user_settings (user_id, key_map) VALUES (?, ?)', [res.insertId, JSON.stringify(defaultKeys)]);
            logger.success('SYSTEM', '✅ Usuario ADMIN creado (User: admin / Pass: admin)');
        }
    } catch (error) {
        console.error('Error creando admin:', error.message);
    }
}

// --- 6. Arranque ---
app.listen(config.PORT, async () => {
    console.log('\n==================================================');
    console.log(`🚀 SERVIDOR ONLINE EN PUERTO: ${config.PORT}`);
    console.log('==================================================\n');
    await createAdminUser();
});