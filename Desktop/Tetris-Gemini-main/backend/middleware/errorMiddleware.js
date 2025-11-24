const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.isOperational) {
        // Operational, trusted error: send message to client
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak details
        logger.error('SYSTEM', 'Unexpected Error', err);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong on the server.'
        });
    }
};