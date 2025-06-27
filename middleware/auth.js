const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (err) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
}

module.exports = verificarToken;
