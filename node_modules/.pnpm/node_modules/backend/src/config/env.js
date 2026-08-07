const path = require('path');
const dotenv = require('dotenv');

// Carga automáticamente el archivo .env según NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;

dotenv.config({
  path: path.resolve(process.cwd(), envFile)
});

// Fallback al .env base si alguna variable no se cargó
dotenv.config();

const required = [
  'PORT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Variable de entorno faltante: ${key} en ${envFile}`);
    process.exit(1);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  }
};

module.exports = { env };
