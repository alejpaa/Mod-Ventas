const authService = require('../services/authService');
const constants = require('../config/constants');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password || password.length < 4) {
            return res.status(400).json({ success: false, message: 'Datos inválidos.' });
        }

        const result = await authService.registerUser(username, password);
        
        logger.success('AUTH', `New User Registered: ${username}`);
        res.status(constants.HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Registration successful.',
            data: result
        });
    } catch (error) {
        next(error); 
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const result = await authService.loginUser(username, password);

        logger.info('AUTH', `User Login: ${username}`);
        res.status(constants.HTTP_STATUS.OK).json({
            success: true,
            message: 'Login successful.',
            ...result
        });
    } catch (error) {
        next(error);
    }
};