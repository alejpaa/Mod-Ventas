/**
 * @file logger.js
 * @description Custom logging utility for auditing and debugging.
 * Writes logs to console (colored) and file (server.log).
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logFilePath = path.join(__dirname, '../../server.log');
        // Ensure log file exists
        if (!fs.existsSync(this.logFilePath)) {
            fs.writeFileSync(this.logFilePath, '');
        }
    }

    _getTimestamp() {
        return new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    _writeToFile(level, context, message) {
        const logLine = `[${this._getTimestamp()}] [${level}] [${context}] ${message}\n`;
        fs.appendFile(this.logFilePath, logLine, (err) => {
            if (err) console.error('Log file write error:', err);
        });
    }

    info(context, message) {
        console.log(`\x1b[36m[INFO]\x1b[0m [${context}] ${message}`);
        this._writeToFile('INFO', context, message);
    }

    success(context, message) {
        console.log(`\x1b[32m[OK]\x1b[0m   [${context}] ${message}`);
        this._writeToFile('SUCCESS', context, message);
    }

    warn(context, message) {
        console.warn(`\x1b[33m[WARN]\x1b[0m [${context}] ${message}`);
        this._writeToFile('WARN', context, message);
    }

    error(context, message, error = null) {
        console.error(`\x1b[31m[ERR]\x1b[0m  [${context}] ${message}`);
        if (error) {
            console.error(error);
            this._writeToFile('ERROR', context, `${message} | Trace: ${error.message}`);
        } else {
            this._writeToFile('ERROR', context, message);
        }
    }
}

module.exports = new Logger();