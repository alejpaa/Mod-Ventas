/**
 * @file config.js
 * @description Configuración centralizada con tu contraseña de MySQL.
 */

require('dotenv').config();

const config = {
    // Configuración del Servidor
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV || 'development',
    
    // Conexión a Base de Datos
    DB: {
        HOST: process.env.DB_HOST || 'localhost',
        USER: process.env.DB_USER || 'root',
        PASSWORD: process.env.DB_PASSWORD || 'My$Q2p0wer!2025', 
        NAME: process.env.DB_NAME || 'tetris_db',
        CONNECTION_LIMIT: 25, // Límite de conexiones simultáneas
        CONNECT_TIMEOUT: 10000
    },

    // Seguridad y Tokens
    JWT_SECRET: process.env.JWT_SECRET || 'tetris_arcade_super_secret_key_2025',
    JWT_EXPIRE: '7d',
    BCRYPT_ROUNDS: 10,

    // Reglas del Juego (Anti-Trampas)
    GAME: {
        MAX_PPS: 5, // Piezas por segundo máximas
        MIN_TIME_PER_LINE: 0.15, // Tiempo mínimo por línea
        MAX_THEORETICAL_SCORE_MULTIPLIER: 2500 
    }
};

module.exports = config;