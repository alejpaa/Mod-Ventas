/**
 * TEST PARA: backend/controllers/authController.js
 */

const authController = require('../controllers/authController');

// 1. MOCKS (Bloqueamos DB y Modelos para que no den error)
jest.mock('../config/db', () => ({}));
jest.mock('../models/User', () => ({}));

// 2. Mock del Servicio
jest.mock('../services/authService', () => ({
    registerUser: jest.fn(),
    loginUser: jest.fn()
}));

// 3. Mock de Utilidades
jest.mock('../utils/logger', () => ({
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
}));

jest.mock('../config/constants', () => ({
    HTTP_STATUS: { OK: 200, CREATED: 201 }
}));

const authService = require('../services/authService');
const logger = require('../utils/logger');

describe('AuthController Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    /**
     * TEST: REGISTER
     */
    describe('register', () => {
        test('Debe retornar 400 si faltan datos', async () => {
            req.body = { username: '' }; 
            await authController.register(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('Debe retornar 201 si el registro es exitoso', async () => {
            // CORRECCIÓN: Password debe tener al menos 4 caracteres
            req.body = { username: 'nuevo', password: '1234' }; 
            authService.registerUser.mockResolvedValue({ id: 1 });

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(logger.success).toHaveBeenCalled();
        });

        test('Debe llamar a next(error) si falla', async () => {
            // CORRECCIÓN: Password válida para pasar la validación y llegar al error
            req.body = { username: 'test', password: '1234' };
            const error = new Error('DB Error');
            authService.registerUser.mockRejectedValue(error);

            await authController.register(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    /**
     * TEST: LOGIN
     */
    describe('login', () => {
        test('Debe retornar 200 y token si login es correcto', async () => {
            req.body = { username: 'juan', password: '123' };
            authService.loginUser.mockResolvedValue({ token: 'abc' });

            await authController.login(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('Debe llamar a next(error) si login falla', async () => {
            req.body = { username: 'juan', password: 'bad' };
            const error = new Error('Bad pass');
            authService.loginUser.mockRejectedValue(error);

            await authController.login(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});