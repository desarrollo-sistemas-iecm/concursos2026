/**
 * Middleware para validar que el usuario cuente con los roles requeridos para el endpoint.
 * @param {Array<number>} rolesPermitidos - IDs de tipos de usuario permitidos (1 = Participante, 2 = Admin, 3 = Juez, 4 = Superadmin)
 */
module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    const { id_tipousuario } = req.user;

    if (rolesPermitidos.includes(id_tipousuario)) {
      return next();
    }

    return res.status(403).json({ error: 'No tienes los permisos necesarios para acceder a este recurso.' });
  };
};
