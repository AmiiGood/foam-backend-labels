const { pool } = require('../config/database');

class Articulo {
    // Obtener todos los artículos con paginación y búsqueda
    static async getAll(params = {}) {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'ID',
            sortOrder = 'ASC'
        } = params;

        const offset = (page - 1) * limit;

        let whereClause = '';
        let queryParams = [];

        if (search) {
            whereClause = `WHERE SKU LIKE ? OR Descripcion LIKE ? OR GroupCode LIKE ? OR FamilyCode LIKE ?`;
            const searchTerm = `%${search}%`;
            queryParams = [searchTerm, searchTerm, searchTerm, searchTerm];
        }

        // Consulta para obtener el total de registros
        const countQuery = `SELECT COUNT(*) as total FROM articulos ${whereClause}`;
        const [countResult] = await pool.execute(countQuery, queryParams);
        const total = countResult[0].total;

        // Consulta para obtener los registros paginados
        const dataQuery = `
      SELECT * FROM articulos 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

        const [rows] = await pool.execute(dataQuery, [...queryParams, limit, offset]);

        return {
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    // Obtener un artículo por ID
    static async getById(id, connection = pool) {
        const query = 'SELECT * FROM articulos WHERE ID = ?';
        const [rows] = await connection.execute(query, [id]);
        return rows[0] || null;
    }

    // Crear un nuevo artículo
    static async create(data) {
        const { SKU, Descripcion, UnitCode, GroupCode, FamilyCode, KindCode, ColorCode, Size, UPCCode, QuantityPerLU } = data;

        try {
            const [result] = await pool.execute(
                'INSERT INTO articulos (SKU, Descripcion, UnitCode, GroupCode, FamilyCode, KindCode, ColorCode, Size, UPCCode, QuantityPerLU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [SKU, Descripcion, UnitCode, GroupCode, FamilyCode, KindCode, ColorCode, Size, UPCCode, QuantityPerLU]
            );

            return this.getById(result.insertId);

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ya existe un artículo con ese ID');
            }
            throw error;
        }
        const [newArticulo] = await pool.execute('SELECT * FROM articulos WHERE ID = LAST_INSERT_ID()');
        return newArticulo[0];
    }

    // Actualizar un artículo
    static async update(id, articuloData) {
        try {
            // Verificar si existe el artículo
            const articulo = await this.getById(id);
            if (!articulo) {
                return null;
            }

            // Construir la consulta UPDATE
            const fields = [];
            const values = [];

            // Construir dinámicamente la consulta UPDATE
            Object.keys(articuloData).forEach(key => {
                if (articuloData[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(articuloData[key] || null);
                }
            });

            if (fields.length === 0) {
                throw new Error('No hay campos para actualizar');
            }

            // Agregar el ID al final de los valores
            values.push(id);
            
            // Ejecutar la actualización
            const query = `UPDATE articulos SET ${fields.join(', ')} WHERE ID = ?`;
            const [result] = await pool.execute(query, values);

            if (result.affectedRows === 0) {
                return null;
            }

            // Obtener el artículo actualizado
            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un artículo
    static async delete(id, connection = pool) {
        const articulo = await this.getById(id, connection);
        if (!articulo) {
            return null;
        }

        const query = 'UPDATE articulos SET Eliminado = TRUE WHERE ID = ?';
        const [result] = await connection.execute(query, [id]);

        return result.affectedRows > 0 ? articulo : null;
    }

    // Restaurar un artículo eliminado lógicamente
    static async restore(id, connection = pool) {
        const articulo = await this.getById(id, connection);
        if (!articulo || articulo.Eliminado === false) {
            return null;
        }

        const query = 'UPDATE articulos SET Eliminado = FALSE WHERE ID = ?';
        const [result] = await connection.execute(query, [id]);

        return result.affectedRows > 0 ? this.getById(id, connection) : null;
    }


    // Verificar si existe un artículo
    static async exists(id) {
        const query = 'SELECT COUNT(*) as count FROM articulos WHERE ID = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0].count > 0;
    }

    // Búsqueda avanzada por múltiples campos
    static async search(filters = {}, connection = pool) {
        let whereConditions = [];
        let queryParams = [];

        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== '') {
                whereConditions.push(`${key} LIKE ?`);
                queryParams.push(`%${filters[key]}%`);
            }
        });

        let query = 'SELECT * FROM articulos';
        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        query += ' ORDER BY ID ASC';

        const [rows] = await connection.execute(query, queryParams);
        return rows;
    }
}

module.exports = Articulo;