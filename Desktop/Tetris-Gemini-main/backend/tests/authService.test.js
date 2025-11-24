const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- MOCKS ---
// Mockeamos User para evitar conexión a DB
jest.mock('../models/User', () => ({
    findByUsername: jest.fn(),
    create: jest.fn(),
    getFullProfile: jest.fn()
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mockeamos config para que no pida variables de entorno
jest.mock('../config/config', () => ({ 
    JWT_SECRET: 'test_secret' 
}));

const User = require('../models/User');

describe('AuthService Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * PRUEBAS PARA REGISTRO
     */
    describe('registerUser', () => {
        test('Debe lanzar error si el usuario ya existe', async () => {
            User.findByUsername.mockResolvedValue({ id: 1, username: 'juan' });

            await expect(authService.registerUser('juan', '1234'))
                .rejects
                .toThrow('El usuario ya existe');
        });

        test('Debe crear usuario si no existe', async () => {
            User.findByUsername.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt_fake');
            bcrypt.hash.mockResolvedValue('hash_fake');
            User.create.mockResolvedValue(100);

            const result = await authService.registerUser('nuevoUser', '1234');

            expect(result).toEqual({ id: 100, username: 'nuevoUser' });
        });
    });

    /**
     * PRUEBAS PARA LOGIN
     */
    describe('loginUser', () => {
        test('Debe lanzar error si usuario no encontrado', async () => {
            User.findByUsername.mockResolvedValue(null);

            await expect(authService.loginUser('fantasma', '1234'))
                .rejects
                .toThrow('Usuario no encontrado');
        });

        test('Debe lanzar error si password incorrecto', async () => {
            const mockUser = { id: 1, username: 'pepe', password_hash: 'hash_real' };
            User.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.loginUser('pepe', 'bad_pass'))
                .rejects
                .toThrow('Contraseña incorrecta');
        });

        test('Debe retornar token y perfil si todo es correcto', async () => {
            const mockUser = { id: 1, username: 'pepe', password_hash: 'hash_real' };
            const mockProfile = { key_map: { up: 'W' } };
            
            User.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token_fake_123');
            User.getFullProfile.mockResolvedValue(mockProfile);

            const result = await authService.loginUser('pepe', 'good_pass');

            expect(result.token).toBe('token_fake_123');
            expect(result.keyMap).toEqual({ up: 'W' });
        });
    });
});