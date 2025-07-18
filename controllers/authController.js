const { pool } = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Obtener usuario con información del rol
    const [usuarios] = await pool.execute(
      `
            SELECT 
                u.id, 
                u.nombre, 
                u.correo, 
                u.contrasena, 
                u.rol_id, 
                u.estado,
                r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id 
            WHERE u.correo = ?
        `,
      [correo]
    );

    const usuario = usuarios[0];

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(401).json({
        success: false,
        message: "Usuario desactivado. Contacte al administrador.",
      });
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    // Incluir más información en el token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        rol_id: usuario.rol_id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol_nombre: usuario.rol_nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol_id: usuario.rol_id,
        rol_nombre: usuario.rol_nombre,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
