const Log = require('../models/Log');

module.exports = {
    getAll: async (req, res) => {
        const logs = await Log.getAll();
        res.json({ success: true, data: logs });
    },
    getById: async (req, res) => {
        const log = await Log.getById(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'No encontrado' });
        res.json({ success: true, data: log });
    },
    create: async (req, res) => {
        try {
            const nuevo = await Log.create(req.body);
            res.status(201).json({ success: true, data: nuevo });
        } catch (error) {
            if (error.message.includes('El usuario especificado no existe')) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario especificado no existe'
                });
            }
            console.error('Error al crear log:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    delete: async (req, res) => {
        try {
            const eliminado = await Log.delete(req.params.id);
            if (!eliminado) return res.status(404).json({ success: false, message: 'No encontrado' });
            res.json({ success: true, data: eliminado });
        } catch (error) {
            console.error('Error al eliminar log:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};
