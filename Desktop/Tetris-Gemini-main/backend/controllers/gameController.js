const gameService = require('../services/gameService');
const constants = require('../config/constants');
const logger = require('../utils/logger');

exports.saveScore = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await gameService.processScore(userId, req.body);
        
        logger.info('GAME', `Score Saved for ${req.user.username}: ${req.body.score}`);
        res.status(constants.HTTP_STATUS.CREATED).json({
            success: true,
            message: constants.MESSAGES.SCORE_SAVED
        });
    } catch (error) {
        next(error);
    }
};

exports.getLeaderboard = async (req, res, next) => {
    try {
        const data = await gameService.fetchLeaderboard();
        res.status(constants.HTTP_STATUS.OK).json({
            success: true,
            data: data
        });
    } catch (error) {
        next(error);
    }
};