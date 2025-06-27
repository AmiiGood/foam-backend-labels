const jwt = require('jsonwebtoken');
const Log = require('../models/Log');
const { pool } = require('../config/database');

async function authWithLog(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    
    try {
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Acceso denegado. Token JWT requerido' 
            });
        }

        // Verificar token
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;

        // Guardar información del log para usarla después
        req.logInfo = {
            usuario_id: req.usuario.id,
            accion: `${req.method} ${req.originalUrl}`
        };

        next();

    } catch (err) {
        console.error('Error en token:', err);
        res.status(401).json({ 
            success: false, 
            message: 'Token no válido. Por favor, inicia sesión nuevamente' 
        });
    }
}

module.exports = authWithLog;
