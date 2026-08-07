const jwt = require('jsonwebtoken');
const vars = require('../config/vars');
const usuariosRepository = require('../repositories/usuarios.repository');

/**
 * Middleware para validar el JWT de sesión y verificar que se mantenga la sesión única activa.
 */
module.exports = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      } else {
        return res.status(401).json({ error: 'Formato de token de acceso inválido.' });
      }
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso no proporcionado.' });
    }
    let decoded;
    
    try {
      decoded = jwt.verify(token, vars.jwtSecret);
    } catch (jwtErr) {
      return res.status(401).json({ error: 'Token de acceso inválido o expirado.' });
    }

    // Consultar el session_id actual del usuario en la base de datos
    const user = await usuariosRepository.findById(decoded.id_usuario);
    
    if (!user || user.status !== 1) {
      return res.status(401).json({ error: 'Usuario inexistente o inactivo.' });
    }

    // Verificar si el session_id del token coincide con el guardado en la BD
    if (!user.session_id || user.session_id !== decoded.session_id) {
      return res.status(401).json({
        code: 'SESSION_REPLACED',
        error: 'Tu sesión ha sido cerrada porque se inició sesión en otro dispositivo.'
      });
    }

    // Adjuntar datos del usuario decodificados al request
    req.user = {
      id_usuario: user.id_usuario,
      usuario: user.usuario,
      id_tipousuario: user.id_tipousuario,
      session_id: user.session_id
    };

    next();
  } catch (err) {
    next(err);
  }
};
