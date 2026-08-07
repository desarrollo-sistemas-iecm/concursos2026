const path = require('path');
// Cargar el archivo .env ubicado específicamente en la misma carpeta que knexfile.js
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const targetDatabase = process.env.DB_NAME;

// Validación estricta para evitar tocar bases de datos no deseadas (como votafilmfest2025)
if (!targetDatabase) {
  throw new Error('ERROR CRÍTICO: La variable DB_NAME no está definida en el archivo .env. Proceso abortado para proteger la base de datos.');
}

if (targetDatabase !== 'ensayo2027') {
  throw new Error(`ERROR CRÍTICO: Se intentó conectar a la base de datos "${targetDatabase}". Solo se permite la conexión a "ensayo2027". Proceso abortado.`);
}

module.exports = {
  development: {
    client: 'mssql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 1433,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: targetDatabase,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
      }
    },
    migrations: {
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  },
  production: {
    client: 'mssql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 1433,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: targetDatabase,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
      }
    },
    migrations: {
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  }
};

