const { pool } = require('../config/database');

class Log {
    static async getAll() {
        const [rows] = await pool.execute('SELECT * FROM logs ORDER BY fecha DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.execute('SELECT * FROM logs WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async create({ usuario_id, accion }) {
        // Si hay usuario_id, verificar que exista
        if (usuario_id) {
            const [existingUser] = await pool.execute('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
            if (!existingUser[0]) {
                throw new Error('El usuario especificado no existe');
            }
        }

        const [result] = await pool.execute(
            'INSERT INTO logs (usuario_id, accion, fecha) VALUES (?, ?, NOW())',
            [usuario_id || null, accion]
        );
        return this.getById(result.insertId);
    }

    static async delete(id) {
        const log = await this.getById(id);
        if (!log) return null;
        await pool.execute('DELETE FROM logs WHERE id = ?', [id]);
        return log;
    }
}

module.exports = Log;
