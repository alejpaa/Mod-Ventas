const db = require('../config/db');

class Score {
    static async save(userId, gameData) {
        const { score, lines, level, time, breakdown } = gameData;
        const sql = `
            INSERT INTO scores 
            (user_id, score, lines_cleared, level_reached, time_played_sec, game_data) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            userId, score, lines, level, time, JSON.stringify(breakdown || {})
        ]);
        return result.insertId;
    }

    static async getTopScores(limit = 10) {
        const sql = `
            SELECT u.username, s.score, s.level_reached, s.lines_cleared, s.played_at
            FROM scores s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.score DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [`${limit}`]); // Limit as string to avoid prep stmt issues
        return rows;
    }
}

module.exports = Score;