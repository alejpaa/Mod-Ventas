const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.registerUser = async (username, password) => {
    // 1. Verificar si existe
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }

    // 2. Crear usuario
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const userId = await User.create(username, hash);
    
    return { id: userId, username };
};

exports.loginUser = async (username, password) => {
    // 1. Buscar
    const user = await User.findByUsername(username);
    if (!user) throw new Error('Usuario no encontrado');

    // 2. Validar Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    // 3. Token
    const token = jwt.sign({ id: user.id, username: user.username }, config.JWT_SECRET, { expiresIn: '7d' });

    // 4. Obtener perfil completo
    const profile = await User.getFullProfile(user.id);
    
    // --- CORRECCIÓN DEL ERROR CRÍTICO ---
    // La base de datos ya devuelve un objeto, NO hay que usar JSON.parse
    let keyMap = profile.key_map;
    if (typeof keyMap === 'string') {
        try { keyMap = JSON.parse(keyMap); } catch(e) {}
    }

    return { token, user: { id: user.id, username: user.username }, keyMap };
};