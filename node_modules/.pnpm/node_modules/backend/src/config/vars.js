require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_iecm_2027_antigravity',
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || null,
    chatId: process.env.TELEGRAM_CHAT_ID || null
  },
  smtp: {
    host: process.env.SMTP_HOST || '145.0.40.63',
    port: parseInt(process.env.SMTP_PORT, 10) || 25,
    user: process.env.SMTP_USER || 'actividadesccycp@iecm.mx',
    pass: process.env.SMTP_PASS || 's1s3c0m',
    from: process.env.SMTP_FROM || '"Instituto Electoral de la Ciudad de México" <no-reply@iecm.mx>',
    bcc: process.env.SMTP_BCC || 'concursos@iecm.mx'
  },
  seedSuperadminPassword: process.env.SEED_SUPERADMIN_PASSWORD || null
};
