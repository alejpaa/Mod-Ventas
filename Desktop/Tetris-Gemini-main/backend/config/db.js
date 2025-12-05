/**
 * @file db.js
 * @description MySQL Connection Pool (Corregido)
 */

const mysql = require('mysql2');
const config = require('./config');
const logger = require('../utils/logger');

// --- CORRECCIÓN AQUÍ ---
// Añadimos .promise() al final de la creación para activar el modo moderno inmediatamente.
const pool = mysql.createPool({
    host: config.DB.HOST,
    user: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.NAME,
    waitForConnections: true,
    connectionLimit: config.DB.CONNECTION_LIMIT || 10,
    queueLimit: 0,
    connectTimeout: config.DB.CONNECT_TIMEOUT || 10000,
    dateStrings: true 
}).promise(); 

// Verificación de conexión inicial
pool.getConnection()
    .then(conn => {
        logger.info('DATABASE', `Connected to MySQL on ${config.DB.HOST}`);
        conn.release();
    })
    .catch(err => {
        logger.error('DATABASE', 'Failed to connect to Database', err);
        logger.warn('DATABASE', 'Please ensure your MySQL service is running via XAMPP.');
    });

module.exports = pool;