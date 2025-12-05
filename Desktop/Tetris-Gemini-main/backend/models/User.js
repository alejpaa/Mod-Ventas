const db = require('../config/db');
const constants = require('../config/constants');

class User {
    /**
     * Find a user by their username.
     * @param {string} username 
     */
    static async findByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(sql, [username]);
        return rows[0];
    }

    /**
     * Create a new user and their settings in a transaction.
     * @param {string} username 
     * @param {string} passwordHash 
     */
    static async create(username, passwordHash) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [resUser] = await connection.execute(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                [username, passwordHash]
            );
            const userId = resUser.insertId;

            const [resSettings] = await connection.execute(
                'INSERT INTO user_settings (user_id, key_map) VALUES (?, ?)',
                [userId, JSON.stringify(constants.DEFAULT_CONTROLS)]
            );

            await connection.commit();
            return userId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getFullProfile(userId) {
        const sql = `
            SELECT u.id, u.username, u.created_at, s.key_map 
            FROM users u 
            LEFT JOIN user_settings s ON u.id = s.user_id 
            WHERE u.id = ?
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows[0];
    }
}

module.exports = User;