/**
 * TEST UNITARIO PARA GAME SERVICE
 */

const gameService = require('../services/gameService');

// --- MOCKS ---
// Mockeamos el modelo Score para evitar conexión a BD
jest.mock('../models/Score', () => ({
    save: jest.fn(),
    getTopScores: jest.fn()
}));

const Score = require('../models/Score');

describe('GameService Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TEST: processScore
     */
    describe('processScore', () => {
        test('Debe guardar el puntaje llamando a Score.save', async () => {
            // Datos de prueba
            const userId = 1;
            const gameData = { score: 5000, lines: 40 };
            
            // Simulamos que la BD devuelve el ID del nuevo score (ej. 10)
            Score.save.mockResolvedValue(10);

            const result = await gameService.processScore(userId, gameData);

            // Verificamos que se llamó al modelo con los datos correctos
            expect(Score.save).toHaveBeenCalledWith(userId, gameData);
            expect(result).toBe(10);
        });
    });

    /**
     * TEST: fetchLeaderboard
     */
    describe('fetchLeaderboard', () => {
        test('Debe traer el top 15 llamando a Score.getTopScores', async () => {
            const mockData = [{ username: 'Pro', score: 9999 }];
            
            // Simulamos respuesta de la BD
            Score.getTopScores.mockResolvedValue(mockData);

            const result = await gameService.fetchLeaderboard();

            // Verificamos que pida exactamente 15 registros
            expect(Score.getTopScores).toHaveBeenCalledWith(15);
            expect(result).toEqual(mockData);
        });
    });
});