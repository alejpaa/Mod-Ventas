const jwt = require('jsonwebtoken');
const config = require('../config/config');
const constants = require('../config/constants');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

exports.protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        logger.warn('AUTH', `Access denied: No token provided from IP ${req.ip}`);
        return next(new AppError('You are not logged in. Please log in to get access.', constants.HTTP_STATUS.UNAUTHORIZED));
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token.', constants.HTTP_STATUS.FORBIDDEN));
    }
};