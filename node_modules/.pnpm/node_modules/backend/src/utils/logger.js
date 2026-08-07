const winston = require('winston');
const path = require('path');
const Transport = winston.Transport;
const vars = require('../config/vars');
const { sendTelegramMessage } = require('../integrations/telegram/bot');

// Sanitización de datos sensibles antes de enviar a monitoreo externo
function sanitizarDatosSensibles(texto) {
  if (typeof texto !== 'string') return texto;

  let resultado = texto;

  // 1. Ocultar contraseñas/passwords en JSON y en parámetros
  resultado = resultado.replace(/("contrasena"\s*:\s*")[^"]+(")/gi, '$1******$2');
  resultado = resultado.replace(/("contrasenaConfirm"\s*:\s*")[^"]+(")/gi, '$1******$2');
  resultado = resultado.replace(/("password"\s*:\s*")[^"]+(")/gi, '$1******$2');
  resultado = resultado.replace(/(password\s*=\s*')[^']+(\')/gi, '$1******$2');
  resultado = resultado.replace(/(pwd\s*=\s*')[^']+(\')/gi, '$1******$2');

  // 2. Ocultar JWTs (Tokens de acceso)
  resultado = resultado.replace(/Bearer\s+[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/gi, 'Bearer ******');
  resultado = resultado.replace(/"token"\s*:\s*"[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+"/gi, '"token":"******"');

  // 3. Ocultar credenciales en la cadena de conexión de la BD
  resultado = resultado.replace(/(password\s*=\s*)[^\s;]+(;?)/gi, '$1******$2');
  resultado = resultado.replace(/(pwd\s*=\s*)[^\s;]+(;?)/gi, '$1******$2');

  // 4. Ocultar CURP (censura los últimos 8 caracteres)
  resultado = resultado.replace(/[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d/gi, (match) => {
    return match.substring(0, 10) + '********';
  });

  // 5. Ocultar correos electrónicos parcialmente
  resultado = resultado.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match) => {
    const parts = match.split('@');
    const name = parts[0];
    const domain = parts[1];
    return name.substring(0, 3) + '***@' + domain;
  });

  return resultado;
}

// Custom Winston Transport to send critical errors to Telegram Bot API
class TelegramTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level || 'error';
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (vars.telegram.token && vars.telegram.chatId) {
      const timestamp = info.timestamp || new Date().toISOString();
      const messageText = sanitizarDatosSensibles(info.message);
      const stack = info.stack ? `\n\n*Stack Trace:*\n\`\`\`${sanitizarDatosSensibles(info.stack)}\`\`\`` : '';

      const telegramMsg = `🚨 *MONITOREO TÉCNICO - ERROR CRÍTICO* 🚨\n\n` +
                          `*Entorno:* \`${vars.env}\`\n` +
                          `*Fecha:* \`${timestamp}\`\n` +
                          `*Mensaje:* ${messageText}${stack}`;

      sendTelegramMessage(telegramMsg).catch(err => {
        console.error('Error al enviar alerta a Telegram:', err.message);
      });
    }

    callback();
  }
}

// Log formats helper to extract error stacks cleanly
const errorStackFormat = winston.format(info => {
  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack
    }, info);
  }
  return info;
});

const logger = winston.createLogger({
  level: vars.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errorStackFormat(),
    winston.format.json()
  ),
  transports: [
    // Consolidated log file
    new winston.transports.File({
      filename: path.join(__dirname, '../../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Error log file
    new winston.transports.File({
      filename: path.join(__dirname, '../../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Telegram channel forwarder
    new TelegramTransport({ level: 'error' })
  ]
});

// Format logging nicely to Console when in development or staging
if (vars.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          return `${timestamp} [${level}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level}]: ${message}`;
      })
    )
  }));
}

module.exports = logger;
