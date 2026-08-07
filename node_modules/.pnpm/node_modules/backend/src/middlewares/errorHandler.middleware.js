const logger = require('../utils/logger');

/**
 * Middleware global para interceptar errores, registrarlos en logs (y Telegram bot)
 * y retornar una respuesta JSON limpia al cliente.
 */
module.exports = (err, req, res, next) => {
  // Registrar el error en Winston (que disparará automáticamente la alerta a Telegram)
  logger.error(err);

  const statusCode = err.status || 500;
  const message = err.message || 'Ocurrió un error interno en el servidor.';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
