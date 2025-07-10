const Impresion = require('../models/Impresion');

class ImpresionController {
    // GET /api/impresiones - Obtener todas las impresiones
    static async getAll(req, res) {
        try {
            const result = await Impresion.getAll(req.query);

            res.json({
                success: true,
                message: 'Impresiones obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getAll impresiones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // GET /api/impresiones/:id - Obtener una impresión por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const impresion = await Impresion.getById(parseInt(id));

            if (!impresion) {
                return res.status(404).json({
                    success: false,
                    message: 'Impresión no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Impresión encontrada',
                data: impresion
            });
        } catch (error) {
            console.error('Error en getById impresion:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // GET /api/impresiones/estadisticas - Obtener estadísticas de impresiones
    static async getEstadisticas(req, res) {
        try {
            const estadisticas = await Impresion.getEstadisticas(req.query);

            res.json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: estadisticas
            });
        } catch (error) {
            console.error('Error en getEstadisticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // GET /api/impresiones/usuario/:usuario_id - Obtener impresiones por usuario
    static async getByUsuario(req, res) {
        try {
            const { usuario_id } = req.params;

            if (!usuario_id || isNaN(usuario_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
            }

            const queryParams = {
                ...req.query,
                usuario_id: parseInt(usuario_id)
            };

            const result = await Impresion.getAll(queryParams);

            res.json({
                success: true,
                message: 'Impresiones del usuario obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getByUsuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // GET /api/impresiones/articulo/:articulo_id - Obtener impresiones por artículo
    static async getByArticulo(req, res) {
        try {
            const { articulo_id } = req.params;

            if (!articulo_id || isNaN(articulo_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de artículo inválido'
                });
            }

            const queryParams = {
                ...req.query,
                articulo_id: parseInt(articulo_id)
            };

            const result = await Impresion.getAll(queryParams);

            res.json({
                success: true,
                message: 'Impresiones del artículo obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getByArticulo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = ImpresionController;