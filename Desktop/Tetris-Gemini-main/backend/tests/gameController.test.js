/**
 * TEST UNITARIO PARA GAME CONTROLLER
 */

const gameController = require('../controllers/gameController');

// --- MOCKS DE DEFENSA (Bloqueo de DB) ---
jest.mock('../config/db', () => ({}));
jest.mock('../models/Score', () => ({}));

// --- MOCK DEL SERVICIO ---
jest.mock('../services/gameService', () => ({
    processScore: jest.fn(),
    fetchLeaderboard: jest.fn()
}));

// --- MOCK DE UTILIDADES ---
jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
}));

jest.mock('../config/constants', () => ({
    HTTP_STATUS: { CREATED: 201, OK: 200 },
    MESSAGES: { SCORE_SAVED: 'Puntaje guardado correctamente' }
}));

const gameService = require('../services/gameService');
const logger = require('../utils/logger');

describe('GameController Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { 
            body: {},
            // IMPORTANTE: Simulamos que el usuario ya pasó por el middleware de Auth
            user: { id: 1, username: 'PlayerOne' } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    /**
     * TEST: saveScore
     */
    describe('saveScore', () => {
        test('Debe guardar puntaje y retornar 201', async () => {
            req.body = { score: 1000, lines: 10 };
            
            // Simulamos éxito del servicio
            gameService.processScore.mockResolvedValue(123); // ID del score

            await gameController.saveScore(req, res, next);

            expect(gameService.processScore).toHaveBeenCalledWith(1, req.body);
            expect(logger.info).toHaveBeenCalled(); // Verifica que genere log
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        test('Debe llamar a next(error) si el servicio falla', async () => {
            req.body = { score: 1000 };
            const error = new Error('Error al guardar');
            
            // Simulamos fallo
            gameService.processScore.mockRejectedValue(error);

            await gameController.saveScore(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    /**
     * TEST: getLeaderboard
     */
    describe('getLeaderboard', () => {
        test('Debe retornar 200 y la lista de puntajes', async () => {
            const mockLeaderboard = [{ user: 'A', score: 100 }];
            
            // Simulamos que el servicio devuelve datos
            gameService.fetchLeaderboard.mockResolvedValue(mockLeaderboard);

            await gameController.getLeaderboard(req, res, next);

            expect(gameService.fetchLeaderboard).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
                success: true, 
                data: mockLeaderboard 
            }));
        });

        test('Debe llamar a next(error) si falla al obtener datos', async () => {
            const error = new Error('Redis caído');
            gameService.fetchLeaderboard.mockRejectedValue(error);

            await gameController.getLeaderboard(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});