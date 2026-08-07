const jwt = require('jsonwebtoken');
const vars = require('../config/vars');
const usuariosRepository = require('../repositories/usuarios.repository');
const logger = require('../utils/logger');

// Mapa global en memoria de sesiones activas: id_usuario -> datos de sesión
const activeSessions = new Map();

/**
 * Inicializa Socket.io para rastreo y control de sesiones únicas.
 * @param {object} io - Instancia del servidor Socket.io
 */
function initSocket(io) {
  // Middleware de Socket.io para verificar el JWT antes de aceptar la conexión
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Autenticación fallida: Token no provisto.'));
      }

      let decoded;
      try {
        decoded = jwt.verify(token, vars.jwtSecret);
      } catch (jwtErr) {
        return next(new Error('Autenticación fallida: Token vencido o inválido.'));
      }

      // Validar contra la base de datos (sesión única)
      const user = await usuariosRepository.findById(decoded.id_usuario);
      if (!user || user.status !== 1) {
        return next(new Error('Autenticación fallida: Usuario inactivo.'));
      }

      if (user.session_id !== decoded.session_id) {
        return next(new Error('Autenticación fallida: Sesión reemplazada.'));
      }

      socket.user = {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        id_tipousuario: user.id_tipousuario,
        nombre_completo: `${user.nombre} ${user.apellido_pat} ${user.apellido_mat}`,
        correo: user.correo,
        session_id: user.session_id
      };

      next();
    } catch (err) {
      return next(new Error('Error de conexión por socket.'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;

    // Si ya existía un socket conectado con la misma sesión, forzar su desconexión
    if (activeSessions.has(user.id_usuario)) {
      const prevSession = activeSessions.get(user.id_usuario);
      const prevSocket = io.sockets.sockets.get(prevSession.socketId);
      if (prevSocket) {
        prevSocket.emit('logout_forced', {
          reason: 'Sesión reemplazada por un inicio de sesión más reciente.'
        });
        prevSocket.disconnect(true);
      }
    }

    // Registrar en el mapa activo
    activeSessions.set(user.id_usuario, {
      id_usuario: user.id_usuario,
      usuario: user.usuario,
      id_tipousuario: user.id_tipousuario,
      nombre_completo: user.nombre_completo,
      correo: user.correo,
      socketId: socket.id,
      connectedAt: new Date(),
      ip: socket.handshake.address
    });

    logger.info(`[SOCKET] Conexión establecida: ${user.usuario} (${user.nombre_completo}) [ID: ${socket.id}]`);

    // Registrar el socket en su canal de usuario específico
    socket.join(`usuario_${user.id_usuario}`);

    // Registrar en canales según su tipo de usuario
    if (user.id_tipousuario === 1) {
      socket.join('participantes');
    } else if (user.id_tipousuario === 2) {
      socket.join('admins');
    } else if (user.id_tipousuario === 3) {
      socket.join('jueces');
    } else if (user.id_tipousuario === 4) {
      socket.join('superadmins');
    }

    // Notificar la lista actualizada a los superadmins
    broadcastSessions(io);

    // Escuchar expulsiones administrativas realizadas por el superadmin
    socket.on('admin_kick_user', (data) => {
      if (socket.user.id_tipousuario === 4 && data && data.id_usuario) {
        logger.info(`[SOCKET] Superadmin [ID: ${socket.user.id_usuario}] solicitó desconectar al usuario ID: ${data.id_usuario}`);
        forceLogoutUser(io, data.id_usuario);
      }
    });

    socket.on('disconnect', () => {
      const current = activeSessions.get(user.id_usuario);
      // Solo removemos si el socket desconectándose es el registrado activo
      if (current && current.socketId === socket.id) {
        activeSessions.delete(user.id_usuario);
        logger.info(`[SOCKET] Conexión cerrada: ${user.usuario} [ID: ${socket.id}]`);
      }
      broadcastSessions(io);
    });
  });
}

/**
 * Transmite la lista de sesiones activas a los superadmins.
 */
function broadcastSessions(io) {
  const list = Array.from(activeSessions.values()).map(s => ({
    id_usuario: s.id_usuario,
    usuario: s.usuario,
    id_tipousuario: s.id_tipousuario,
    nombre_completo: s.nombre_completo,
    correo: s.correo,
    connectedAt: s.connectedAt,
    ip: s.ip
  }));

  io.to('superadmins').emit('sesiones_actualizadas', list);
}

/**
 * Desconecta limpiamente a un usuario de su socket cuando cierra sesión de forma voluntaria.
 * No emite ningún mensaje de "expulsión remota".
 */
function cleanDisconnectUser(io, id_usuario) {
  const session = activeSessions.get(id_usuario);
  if (session) {
    logger.info(`[SOCKET] Cierre voluntario de sesión para usuario ID: ${id_usuario}`);
    const socket = io.sockets.sockets.get(session.socketId);
    if (socket) {
      socket.disconnect(true);
    }
    activeSessions.delete(id_usuario);
  }
}

/**
 * Fuerza el logout de un usuario particular desconectando su socket y notificándolo.
 */
function forceLogoutUser(io, id_usuario) {
  const session = activeSessions.get(id_usuario);
  if (session) {
    logger.info(`[SOCKET] Forzando cierre de conexión para usuario ID: ${id_usuario}`);
    const socket = io.sockets.sockets.get(session.socketId);
    if (socket) {
      socket.emit('logout_forced', {
        reason: 'Tu sesión ha sido cerrada de forma remota por un administrador.'
      });
      socket.disconnect(true);
    }
    activeSessions.delete(id_usuario);
  }
}

/**
 * Fuerza el logout global de todos los sockets conectados del sistema.
 */
function forceLogoutAll(io) {
  logger.info(`[SOCKET] Forzando cierre de sesión global para todos los usuarios conectados.`);
  io.emit('logout_forced', {
    reason: 'Todas las sesiones activas han sido cerradas globalmente.'
  });

  activeSessions.clear();

  // Desconectar físicamente todas las conexiones
  for (const socket of io.sockets.sockets.values()) {
    socket.disconnect(true);
  }
}

module.exports = {
  initSocket,
  forceLogoutUser,
  cleanDisconnectUser,
  forceLogoutAll,
  activeSessions
};
