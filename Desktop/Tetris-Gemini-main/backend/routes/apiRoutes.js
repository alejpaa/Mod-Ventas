const express = require('express');
const router = express.Router();

// Importar Controladores
const authController = require('../controllers/authController');
const gameController = require('../controllers/gameController');

// --- CORRECCIÓN: Importar desde la carpeta 'middleware' (singular) y archivos cortos ---
const { protect } = require('../middleware/auth'); 
const { antiCheat } = require('../middleware/security');

// Rutas Públicas
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/leaderboard', gameController.getLeaderboard);

// Rutas Privadas (Requieren Login)
router.post('/stats', protect, antiCheat, gameController.saveScore);

// Test
router.get('/health', (req, res) => {
    res.json({ status: 'ONLINE', uptime: process.uptime() });
});

module.exports = router;