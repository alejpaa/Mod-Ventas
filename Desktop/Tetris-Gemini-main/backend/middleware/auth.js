/**
 * @file auth.js
 * @description Middleware para proteger rutas con JWT
 */
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.protect = (req, res, next) => {
    let token;

    // Buscar el token en el header "Authorization: Bearer ..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Acceso denegado. No hay token.' });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
};