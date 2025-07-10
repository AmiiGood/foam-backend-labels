const { pool } = require("../config/database");

class Impresion {
  // Crear un nuevo registro de impresión
  static async create(data) {
    const {
      articulo_id,
      usuario_id,
      cantidad,
      fecha_impresion = new Date(),
    } = data;

    try {
      const [result] = await pool.execute(
        "INSERT INTO impresiones (articulo_id, usuario_id, cantidad, fecha_impresion) VALUES (?, ?, ?, ?)",
        [articulo_id, usuario_id, cantidad, fecha_impresion]
      );

      return this.getById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Obtener una impresión por ID
  static async getById(id, connection = pool) {
    const query = "SELECT * FROM impresiones WHERE id = ?";
    const [rows] = await connection.execute(query, [id]);
    return rows[0] || null;
  }

  // Obtener todas las impresiones con información del artículo y usuario
  static async getAll(params = {}) {
    const {
      page = 1,
      limit = 10,
      articulo_id = null,
      usuario_id = null,
      fecha_inicio = null,
      fecha_fin = null,
      sortBy = "fecha_impresion",
      sortOrder = "DESC",
    } = params;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];

    // Filtros opcionales
    if (articulo_id) {
      whereConditions.push("i.articulo_id = ?");
      queryParams.push(articulo_id);
    }

    if (usuario_id) {
      whereConditions.push("i.usuario_id = ?");
      queryParams.push(usuario_id);
    }

    if (fecha_inicio) {
      whereConditions.push("DATE(i.fecha_impresion) >= ?");
      queryParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      whereConditions.push("DATE(i.fecha_impresion) <= ?");
      queryParams.push(fecha_fin);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Consulta para obtener el total de registros
    const countQuery = `
            SELECT COUNT(*) as total 
            FROM impresiones i 
            ${whereClause}
        `;
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = countResult[0].total;

    // Consulta para obtener los registros paginados con información relacionada
    const dataQuery = `
            SELECT 
                i.*,
                a.SKU,
                a.Descripcion,
                u.nombre as usuario_nombre,
                u.correo as usuario_email
            FROM impresiones i
            LEFT JOIN articulos a ON i.articulo_id = a.ID
            LEFT JOIN usuarios u ON i.usuario_id = u.id
            ${whereClause}
            ORDER BY i.${sortBy} ${sortOrder}
            LIMIT ? OFFSET ?
        `;

    const [rows] = await pool.execute(dataQuery, [
      ...queryParams,
      limit,
      offset,
    ]);

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Obtener estadísticas de impresiones
  static async getEstadisticas(params = {}) {
    const {
      fecha_inicio = null,
      fecha_fin = null,
      articulo_id = null,
      usuario_id = null,
    } = params;

    let whereConditions = [];
    let queryParams = [];

    if (fecha_inicio) {
      whereConditions.push("DATE(fecha_impresion) >= ?");
      queryParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      whereConditions.push("DATE(fecha_impresion) <= ?");
      queryParams.push(fecha_fin);
    }

    if (articulo_id) {
      whereConditions.push("articulo_id = ?");
      queryParams.push(articulo_id);
    }

    if (usuario_id) {
      whereConditions.push("usuario_id = ?");
      queryParams.push(usuario_id);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
            SELECT 
                COUNT(*) as total_impresiones,
                SUM(cantidad) as total_etiquetas,
                AVG(cantidad) as promedio_etiquetas_por_impresion,
                DATE(fecha_impresion) as fecha,
                COUNT(DISTINCT articulo_id) as articulos_diferentes,
                COUNT(DISTINCT usuario_id) as usuarios_diferentes
            FROM impresiones 
            ${whereClause}
            GROUP BY DATE(fecha_impresion)
            ORDER BY fecha DESC
        `;

    const [rows] = await pool.execute(query, queryParams);
    return rows;
  }
}

module.exports = Impresion;
