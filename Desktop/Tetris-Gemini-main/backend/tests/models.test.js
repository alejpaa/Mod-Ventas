/**
 * TEST UNITARIO PARA MODELOS (User y Score)
 * CORREGIDO: Soluciona el error de 'mockConnection before initialization'
 */

const db = require('../config/db');
const User = require('../models/User');
const Score = require('../models/Score');

// --- 1. DEFINICIÓN DEL OBJETO MOCK ---
// Lo definimos aquí, pero NO lo usamos dentro de jest.mock() todavía
const mockConnection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    execute: jest.fn()
};

// --- 2. MOCK DEL MÓDULO DB ---
// Solo definimos la estructura básica. El valor de retorno lo inyectamos después.
jest.mock('../config/db', () => ({
    execute: jest.fn(),
    getConnection: jest.fn() 
}));

// --- 3. MOCK DE CONSTANTES ---
jest.mock('../config/constants', () => ({
    DEFAULT_CONTROLS: { up: 'W', down: 'S' }
}));

describe('Models Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        
        // --- CRÍTICO: ASIGNACIÓN TARDÍA ---
        // Aquí es seguro asignar mockConnection porque el archivo ya cargó.
        db.getConnection.mockResolvedValue(mockConnection);
        
        // Limpiamos los espías internos de la conexión falsa
        mockConnection.beginTransaction.mockClear();
        mockConnection.commit.mockClear();
        mockConnection.rollback.mockClear();
        mockConnection.release.mockClear();
        mockConnection.execute.mockClear();
    });

    // ==========================================
    // PRUEBAS PARA MODELO: USER
    // ==========================================
    describe('User Model', () => {
        
        test('findByUsername: debe retornar el usuario si existe', async () => {
            const mockRows = [{ id: 1, username: 'juan' }];
            db.execute.mockResolvedValue([mockRows]);

            const result = await User.findByUsername('juan');

            expect(db.execute).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users'), 
                ['juan']
            );
            expect(result).toEqual(mockRows[0]);
        });

        test('getFullProfile: debe retornar perfil con configuración', async () => {
            const mockRow = { id: 1, username: 'juan', key_map: '{}' };
            db.execute.mockResolvedValue([[mockRow]]);

            const result = await User.getFullProfile(1);

            expect(result).toEqual(mockRow);
        });

        // --- TEST DE TRANSACCIÓN (CREATE) ---
        test('create: debe ejecutar transacción exitosa (commit)', async () => {
            // 1. Insert User -> devuelve ID 10
            // 2. Insert Settings -> devuelve éxito
            mockConnection.execute
                .mockResolvedValueOnce([{ insertId: 10 }]) 
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            const userId = await User.create('nuevo', 'hash123');

            // Verificaciones de Transacción
            expect(db.getConnection).toHaveBeenCalled();
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.execute).toHaveBeenCalledTimes(2); 
            expect(mockConnection.commit).toHaveBeenCalled(); 
            expect(mockConnection.release).toHaveBeenCalled(); 
            expect(userId).toBe(10);
        });

        test('create: debe hacer rollback si falla algo', async () => {
            const errorSimulado = new Error('Error SQL');
            mockConnection.execute.mockRejectedValue(errorSimulado);

            await expect(User.create('fail', 'hash')).rejects.toThrow('Error SQL');

            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.rollback).toHaveBeenCalled(); // ¡Debe haber Rollback!
            expect(mockConnection.commit).not.toHaveBeenCalled();
            expect(mockConnection.release).toHaveBeenCalled(); 
        });
    });

    // ==========================================
    // PRUEBAS PARA MODELO: SCORE
    // ==========================================
    describe('Score Model', () => {

        test('save: debe guardar puntaje y devolver ID', async () => {
            const gameData = { 
                score: 1000, 
                lines: 10, 
                level: 5, 
                time: 300, 
                breakdown: { single: 1 } 
            };
            db.execute.mockResolvedValue([{ insertId: 55 }]);

            const result = await Score.save(1, gameData);

            expect(db.execute).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO scores'),
                expect.arrayContaining([1, 1000, 10, 5])
            );
            expect(result).toBe(55);
        });

        test('save: debe manejar breakdown indefinido', async () => {
            const gameData = { score: 100, lines: 1, level: 1, time: 10 };
            db.execute.mockResolvedValue([{ insertId: 56 }]);

            await Score.save(1, gameData);

            expect(db.execute).toHaveBeenCalledWith(
                expect.any(String),
                expect.arrayContaining(['{}']) 
            );
        });

        test('getTopScores: debe retornar lista de puntajes', async () => {
            const mockScores = [{ username: 'Pro', score: 9999 }];
            db.execute.mockResolvedValue([mockScores]);

            const result = await Score.getTopScores(5);

            expect(db.execute).toHaveBeenCalledWith(
                expect.stringContaining('ORDER BY s.score DESC'),
                ['5']
            );
            expect(result).toEqual(mockScores);
        });
    });
});