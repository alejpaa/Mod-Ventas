/**
 * @file constants.js
 * @description Application-wide constants to avoid magic strings.
 */

module.exports = {
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_ERROR: 500
    },
    MESSAGES: {
        WELCOME: 'Welcome to Tetris Retro API v3.0',
        DB_CONNECTED: 'Database connection established successfully.',
        DB_ERROR: 'Critical Database Error.',
        AUTH_FAILED: 'Authentication failed. Please check your credentials.',
        SCORE_SAVED: 'High score saved successfully!',
        CHEAT_DETECTED: 'Anomaly detected. Score rejected by anti-cheat system.'
    },
    DEFAULT_CONTROLS: {
        left: 'ArrowLeft', 
        right: 'ArrowRight', 
        down: 'ArrowDown', 
        rot: 'ArrowUp', 
        drop: 'Space', 
        hold: 'KeyC'
    }
};