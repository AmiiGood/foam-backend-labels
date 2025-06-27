const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const saltRounds = 10; // Número de rondas de hash para bcrypt

class Usuario {
    static async getAll() {
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE estado = 1');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async create(data) {
        const { nombre, correo, contrasena, rol_id } = data;
        
        // Verificar si el correo ya existe
        const [existingUser] = await pool.execute('SELECT id FROM usuarios WHERE correo = ?', [correo]);
        if (existingUser[0]) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Verificar si el rol existe
        const [existingRole] = await pool.execute('SELECT id FROM roles WHERE id = ?', [rol_id]);
        if (!existingRole[0]) {
            throw new Error('El rol especificado no existe');
        }

        // Encriptar la contraseña antes de guardarla
        const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);

        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)',
            [nombre, correo, contrasenaEncriptada, rol_id]
        );
        return this.getById(result.insertId);
    }

    static async update(id, data) {
        const fields = [], values = [];
        Object.entries(data).forEach(([key, value]) => {
            fields.push(`${key} = ?`);
            values.push(value);
        });
        if (!fields.length) return null;
        values.push(id);
        await pool.execute(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.getById(id);
    }

    static async delete(id) {
        const user = await this.getById(id);
        if (!user) return null;
        
        // Obtener el estado actual del usuario
        const estadoActual = user.estado;
        
        // Cambiar el estado (1 -> 0 o 0 -> 1)
        const nuevoEstado = estadoActual === 1 ? 0 : 1;
        
        await pool.execute(
            'UPDATE usuarios SET estado = ? WHERE id = ?', 
            [nuevoEstado, id]
        );
        
        return { ...user, estado: nuevoEstado };
    }
}

module.exports = Usuario;
