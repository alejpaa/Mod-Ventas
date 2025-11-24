const config = require('../config/config');

exports.antiCheat = (req, res, next) => {
    const { score, lines, time } = req.body;
    if (score === undefined) return next();
    
    if (score < 0 || lines < 0 || time < 0) {
        return res.status(400).json({ success: false, message: 'Datos corruptos.' });
    }
    next();
};

exports.secureHeaders = (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
};