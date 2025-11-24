/**
 * @file appError.js
 * @description Custom Error class to handle operational errors.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Distinguish operational errors from bugs

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;