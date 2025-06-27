const Log = require('../models/Log');

async function logHandler(req, res, next) {
    // Guardar el log al final de la petición
    res.on('finish', async () => {
        if (req.logInfo) {
            try {
                await Log.create({
                    usuario_id: req.logInfo.usuario_id,
                    accion: req.logInfo.accion,
                    exito: req.logInfo.exito
                });
            } catch (error) {
                console.error('Error al guardar log:', error);
            }
        }
    });

    next();
}

module.exports = logHandler;
