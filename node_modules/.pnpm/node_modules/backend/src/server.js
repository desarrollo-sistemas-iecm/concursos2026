const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const os = require('os');
const { env } = require('./config/env');
const { logger, logSystem, logAction, logError } = require('./config/logger');
const db = require('./config/db');

// Rutas
const authRoutes = require('./routes/auth.routes');
const catalogosRoutes = require('./routes/catalogos.routes');
const participanteRoutes = require('./routes/participante.routes');
const adminRoutes = require('./routes/admin.routes');
const juezRoutes = require('./routes/juez.routes');
const superadminRoutes = require('./routes/superadmin.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');
const fs = require('fs');

// Sockets y Middlewares
const sesionesSocket = require('./sockets/sesiones.socket');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();
const server = http.createServer(app);

// Inicializar Socket.io con configuración CORS compatible
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Compartir la instancia de io con los controladores Express
app.set('io', io);

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro de peticiones (logs de consola)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logAction(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Sockets
sesionesSocket.initSocket(io);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/participante', participanteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/juez', juezRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Endpoint protegido para visualizar y descargar ensayos en PDF
const authMiddleware = require('./middlewares/auth.middleware');
const acuseController = require('./controllers/acuse.controller');

app.get('/api/documentos/descargar-acuse', authMiddleware, acuseController.solicitarDescargaAcuse);
app.get('/api/documentos/obtener-acuse', acuseController.obtenerAcusePDF);

function buscarArchivoRecursivo(dir, filename) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const found = buscarArchivoRecursivo(fullPath, filename);
      if (found) return found;
    } else if (file === filename || fullPath.endsWith(path.sep + filename)) {
      return fullPath;
    }
  }
  return null;
}

app.get('/api/documentos/*', authMiddleware, (req, res) => {
  const reqPath = req.params[0];
  const directPath = path.join(__dirname, '../uploads/ensayos', reqPath);
  
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return res.sendFile(directPath);
  }

  // Fallback de búsqueda recursiva si se consulta sólo el nombre del archivo
  const filenameOnly = path.basename(reqPath);
  const found = buscarArchivoRecursivo(path.join(__dirname, '../uploads/ensayos'), filenameOnly);
  if (found) {
    return res.sendFile(found);
  }

  res.status(404).json({ error: 'Archivo no encontrado.' });
});

// 1. Servir los archivos estáticos compilados por Vite
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// 2. Fallback para Vue Router (History Mode)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && req.headers.accept?.includes('text/html')) {
    return res.sendFile(path.join(publicPath, 'index.html'));
  }
  next();
});

// Middleware Global de Control de Errores
app.use(errorHandler);

/**
 * Obtener IP local del servidor
 */
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

/**
 * Función principal de arranque del servidor
 */
const startServer = async () => {
  const dbHost = env.db.server || 'localhost';
  const dbName = env.db.database || 'master';

  try {
    // Probar de forma asíncrona la conectividad a SQL Server
    await db.raw('SELECT 1+1 AS result');

    server.listen(env.port, () => {
      const ip = getLocalIp();
      let serverUrl = `http://localhost:${env.port}`;

      if (env.nodeEnv === 'production') {
        serverUrl = 'https://aplicaciones.iecm.mx/Ensayo2027';
      } else if (ip === '145.0.40.48') {
        serverUrl = `http://145.0.40.48:${env.port}/Ensayo2027`;
      }

      logSystem('╔══════════════════════════════════════╗');
      logSystem('║   HACKATON 2027 — Backend API  ║');
      logSystem('╚══════════════════════════════════════╝');
      logSystem(`🌐 Ambiente     : ${env.nodeEnv}`);
      logSystem(`🚀 Servidor     : ${serverUrl}`);
      logSystem(`📦 Base de datos: ${dbName} @ ${dbHost}`);
      logSystem('✅ Conexión BD  : Exitosa');
      logSystem('📋 Versión API  : v1');
      logSystem(`⏰ Inicio       : ${new Date().toISOString().replace('T', ' ').slice(0, 19)}`);
      logSystem('══════════════════════════════════════════');
    });
  } catch (error) {
    logError(`❌ ERROR DE CONEXIÓN A BASE DE DATOS: ${error.message}`);
    logError(`   Servidor : ${dbHost}`);
    logError(`   BD       : ${dbName}`);
    process.exit(1);
  }
};

startServer();

// Manejadores de excepciones no capturadas a nivel de proceso
process.on('unhandledRejection', (reason, promise) => {
  logger.error(new Error(`Rechazo de promesa no manejado: ${reason}`));
});

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});
