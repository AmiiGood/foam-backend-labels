const Articulo = require('../models/Articulo');
const {
    createArticuloSchema,
    updateArticuloSchema,
    searchParamsSchema
} = require('../validators/articuloValidator');
const Log = require('../models/Log');
const { printLabel } = require('../utils/printer');

class ArticuloController {
    // GET /api/articulos - Obtener todos los artículos
    static async getAll(req, res) {
        try {
            const { error, value } = searchParamsSchema.validate(req.query);

            if (error) {
                req.logInfo.exito = false;
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros de búsqueda inválidos',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const result = await Articulo.getAll(value);

            res.json({
                success: true,
                message: 'Artículos obtenidos exitosamente',
                ...result
            });
        } catch (error) {
            req.logInfo.exito = false;
            console.error('Error en getAll:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // GET /api/articulos/:id - Obtener un artículo por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const articulo = await Articulo.getById(parseInt(id));

            if (!articulo) {
                req.logInfo.exito = false;
                return res.status(404).json({
                    success: false,
                    message: 'Artículo no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Artículo encontrado',
                data: articulo
            });
        } catch (error) {
            console.error('Error en getById:', error);
            req.logInfo.exito = false;
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // POST /api/articulos - Crear un nuevo artículo
    static async create(req, res) {
        try {
            const { error, value } = createArticuloSchema.validate(req.body);

            if (error) {
                req.logInfo.exito = false;
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { ID, ...articuloData } = value; // Desestructurar para quitar el ID

            try {
                const nuevoArticulo = await Articulo.create(articuloData);

                // Solo crear log si la operación fue exitosa
                await Log.create({
                    usuario_id: req.usuario.id,
                    accion: 'POST /api/articulos'
                });

                res.status(201).json({
                    success: true,
                    message: 'Artículo creado exitosamente',
                    data: nuevoArticulo
                });
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe un artículo con ese ID'
                    });
                }
                throw error;
            }
        } catch (error) {
            console.error('Error en create:', error);
            req.logInfo.exito = false;
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // PUT /api/articulos/:id - Actualizar un artículo
    static async update(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const { error, value } = updateArticuloSchema.validate(req.body);

            if (error) {
                req.logInfo.exito = false;
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const articuloActualizado = await Articulo.update(parseInt(id), value);
            if (!articuloActualizado) {
                return res.status(404).json({
                    success: false,
                    message: 'Artículo no encontrado'
                });
            }

            // Solo crear log si la operación fue exitosa
            await Log.create({
                usuario_id: req.usuario.id,
                accion: `PUT /api/articulos/${id}`
            });

            res.json({
                success: true,
                message: 'Artículo actualizado exitosamente',
                data: articuloActualizado
            });
        } catch (error) {
            console.error('Error en update:', error);
            req.logInfo.exito = false;
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // DELETE /api/articulos/:id - Eliminar un artículo
    static async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                req.logInfo.exito = false;
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const articuloEliminado = await Articulo.delete(parseInt(id), req.dbConnection);

            if (!articuloEliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Artículo no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Artículo eliminado exitosamente',
                data: articuloEliminado
            });
        } catch (error) {
            console.error('Error en delete:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // POST /api/articulos/search - Búsqueda avanzada
    static async search(req, res) {
        try {
            const filters = req.body;
            const results = await Articulo.search(filters, req.dbConnection);

            res.json({
                success: true,
                message: 'Búsqueda completada',
                count: results.length,
                data: results
            });
        } catch (error) {
            console.error('Error en search:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // PATCH /api/articulos/:id/restore - Restaurar un artículo eliminado
    static async restore(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                req.logInfo.exito = false;
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const articuloRestaurado = await Articulo.restore(parseInt(id), req.dbConnection);

            if (!articuloRestaurado) {
                return res.status(404).json({
                    success: false,
                    message: 'Artículo no encontrado o ya activo'
                });
            }

            res.json({
                success: true,
                message: 'Artículo restaurado exitosamente',
                data: articuloRestaurado
            });
        } catch (error) {
            console.error('Error en restore:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // POST /api/articulos/print-labels - Imprimir etiquetas
    static async printLabels(req, res) {
        try {
            const { sku, descripcion, color, size, qty, cantidad } = req.body;

            if (!sku || !descripcion || !color || !size || !qty || !cantidad) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos requeridos'
                });
            }

            const fecha = new Date().toISOString().split('T')[0];  // Fecha en formato YYYY-MM-DD
            const printerIp = '172.16.115.213';

            // Crear el contenido para cada etiqueta
            const etiquetas = [];
            for (let i = 1; i <= cantidad; i++) {
                const codigo = `${fecha}$${sku}$${qty}`;
                const etiqueta = {
                    sku,
                    descripcion,
                    color,
                    size,
                    qty,
                    fecha,
                    codigo,
                    qr: codigo  // Código para el QR
                };
                etiquetas.push(etiqueta);

                // Enviar la etiqueta a la impresora
                printLabel(sku, descripcion, color, size, qty, fecha, codigo, i, printerIp);  // i es el número de etiqueta
            }

            res.json({
                success: true,
                message: 'Etiquetas generadas exitosamente',
                etiquetas
            });
        } catch (error) {
            console.error('Error en printLabels:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = ArticuloController;
