const { pool } = require('../config/database');

class Rol {
    static async getAll() {
        const [rows] = await pool.execute('SELECT * FROM roles');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.execute('SELECT * FROM roles WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async create(data) {
        const [result] = await pool.execute(
            'INSERT INTO roles (nombre, descripcion) VALUES (?, ?)',
            [data.nombre, data.descripcion]
        );
        return this.getById(result.insertId);
    }

    static async update(id, { nombre }) {
        await pool.execute('UPDATE roles SET nombre = ? WHERE id = ?', [nombre, id]);
        return this.getById(id);
    }

    static async delete(id) {
        const rol = await this.getById(id);
        if (!rol) return null;
        await pool.execute('DELETE FROM roles WHERE id = ?', [id]);
        return rol;
    }
}

module.exports = Rol;
