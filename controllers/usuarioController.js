const Usuario = require('../models/Usuario');
const { usuarioSchema, updateUsuarioSchema } = require('../validators/usuarioValidator');
const Log = require('../models/Log');
class UsuarioController {
    static async getAll(req, res) {
        const users = await Usuario.getAll();
        res.json({ success: true, data: users });
    }

    static async getById(req, res) {
        const user = await Usuario.getById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'No encontrado' });
        res.json({ success: true, data: user });
    }

    static async create(req, res) {
        const { error, value } = usuarioSchema.validate(req.body);
        
        if (error) {
            const validationErrors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));
            req.logInfo.exito = false;
            return res.status(400).json({
                success: false,
                errors: validationErrors
            });
        }

        try {
            const nuevo = await Usuario.create(value);
            
            // Solo crear log si la operación fue exitosa
            await Log.create({
                usuario_id: req.usuario.id,
                accion: 'POST /api/usuarios'
            });

            res.status(201).json({ 
                success: true, 
                data: nuevo 
            });
        } catch (error) {
            if (error.message.includes('correo electrónico ya está registrado')) {
                req.logInfo.exito = false;
                return res.status(400).json({ 
                    success: false, 
                    message: 'Este correo electrónico ya está registrado' 
                });
            }
            
            if (error.message.includes('El rol especificado no existe')) {
                req.logInfo.exito = false;
                return res.status(400).json({ 
                    success: false, 
                    message: 'El rol especificado no existe' 
                });
            }
            
            console.error('Error al crear usuario:', error);
            req.logInfo.exito = false;
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async update(req, res) {
        const { error, value } = updateUsuarioSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details });
        const actualizado = await Usuario.update(req.params.id, value);
        if (!actualizado) return res.status(404).json({ success: false, message: 'No encontrado' });
        res.json({ success: true, data: actualizado });
    }

    static async delete(req, res) {
        const eliminado = await Usuario.delete(req.params.id);
        if (!eliminado) return res.status(404).json({ success: false, message: 'No encontrado' });
        res.json({ success: true, data: eliminado });
    }
}

module.exports = UsuarioController;
