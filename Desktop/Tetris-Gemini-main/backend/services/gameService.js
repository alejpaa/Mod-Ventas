/**
 * @file gameService.js
 * @description Business logic for Gameplay (Scores, Leaderboards).
 */

const Score = require('../models/Score');

exports.processScore = async (userId, gameData) => {
    // Logic to calculate statistics or achievements could go here
    const scoreId = await Score.save(userId, gameData);
    return scoreId;
};

exports.fetchLeaderboard = async () => {
    // Future logic: caching integration (Redis) could go here
    const leaderboard = await Score.getTopScores(15);
    return leaderboard;
};