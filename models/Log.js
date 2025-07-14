const { pool } = require("../config/database");

class Log {
  static async getAll(page = 1, limit = 15) {
    const offset = (page - 1) * limit;

    // Obtener logs con paginación
    const [rows] = await pool.execute(
      "SELECT * FROM logs ORDER BY fecha DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    // Obtener total de registros para calcular páginas
    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM logs"
    );
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getById(id) {
    const [rows] = await pool.execute("SELECT * FROM logs WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async create({ usuario_id, accion }) {
    // Si hay usuario_id, verificar que exista
    if (usuario_id) {
      const [existingUser] = await pool.execute(
        "SELECT id FROM usuarios WHERE id = ?",
        [usuario_id]
      );
      if (!existingUser[0]) {
        throw new Error("El usuario especificado no existe");
      }
    }

    const [result] = await pool.execute(
      "INSERT INTO logs (usuario_id, accion, fecha) VALUES (?, ?, NOW())",
      [usuario_id || null, accion]
    );

    return this.getById(result.insertId);
  }

  static async delete(id) {
    const log = await this.getById(id);
    if (!log) return null;

    await pool.execute("DELETE FROM logs WHERE id = ?", [id]);
    return log;
  }
}

module.exports = Log;
