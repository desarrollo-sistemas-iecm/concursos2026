const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');

// Asegurar existencia de directorio de logs
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ─── Códigos de Colores ANSI ─────────────────────────────────────
const C = {
  reset:        '\x1b[0m',
  bold:         '\x1b[1m',
  gray:         '\x1b[90m',
  greenBright:  '\x1b[92m',
  blueBright:   '\x1b[94m',
  cyanBright:   '\x1b[96m',
  yellowBright: '\x1b[93m',
  redBright:    '\x1b[91m',
  magenta:      '\x1b[35m',
  bgGreen:  '\x1b[42m',
  bgBlue:   '\x1b[44m',
  bgCyan:   '\x1b[46m',
  bgYellow: '\x1b[43m',
  bgRed:    '\x1b[41m',
  bgMagenta:'\x1b[45m',
};

// ─── Formato de Consola (con Colores por Categoría) ──────────────
const consoleFormat = printf(({ level, message, timestamp, category }) => {
  const ts = `${C.gray}${timestamp}${C.reset}`;
  switch (category) {
    case 'session':
      return `${ts} ${C.bgGreen}${C.bold} SESIÓN ${C.reset} ${C.greenBright}${message}${C.reset}`;
    case 'action':
      return `${ts} ${C.bgBlue}${C.bold} ACCIÓN ${C.reset} ${C.blueBright}${message}${C.reset}`;
    case 'query':
      return `${ts} ${C.bgCyan}${C.bold} CONSULT ${C.reset} ${C.cyanBright}${message}${C.reset}`;
    case 'warn':
      return `${ts} ${C.bgYellow}${C.bold} AVISO  ${C.reset} ${C.yellowBright}${message}${C.reset}`;
    case 'error':
      return `${ts} ${C.bgRed}${C.bold} ERROR  ${C.reset} ${C.redBright}${message}${C.reset}`;
    case 'system':
      return `${ts} ${C.bgMagenta}${C.bold} SYSTEM ${C.reset} ${C.magenta}${message}${C.reset}`;
    default:
      return `${ts} [${level}]: ${message}`;
  }
});

// ─── Formato de Archivo (Limpio, sin códigos ANSI) ──────────────
const fileFormat = printf(({ level, message, timestamp, category }) => {
  const cat = category ? `[${category.toUpperCase()}]` : `[${level.toUpperCase()}]`;
  return `${timestamp} ${cat} ${message}`;
});

// ─── Logger Instancia ───────────────────────────────────────────
const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    fileFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        timestamp({ format: 'HH:mm:ss' }),
        consoleFormat
      )
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/activity.log' }),
  ]
});

// ─── Métodos Auxiliares Exportados ──────────────────────────────
const logSession = (message) => logger.info(message, { category: 'session' });
const logAction  = (message) => logger.info(message, { category: 'action' });
const logQuery   = (message) => logger.info(message, { category: 'query' });
const logWarn    = (message) => logger.warn(message, { category: 'warn' });
const logError   = (message) => logger.error(message, { category: 'error' });
const logSystem  = (message) => logger.info(message, { category: 'system' });

// Formateador de contexto del usuario
const userTag = (user) => {
  if (!user) return '[anónimo]';
  return `[id=${user.id_usuario || user.id} | Rol=${user.perfil || user.id_rol} | Usuario=${user.usuario}]`;
};

module.exports = { logger, logSession, logAction, logQuery, logWarn, logError, logSystem, userTag };
