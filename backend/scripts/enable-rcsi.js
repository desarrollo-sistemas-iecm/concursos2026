/**
 * Script para habilitar Read Committed Snapshot Isolation (RCSI) en la BD.
 *
 * PROBLEMA QUE RESUELVE:
 * SQL Server por defecto usa bloqueos de lectura compartidos (S-locks).
 * Cuando una transacción activa tiene un X-lock (escritura) sobre una página
 * de la tabla `usuarios`, cualquier SELECT en esa tabla desde otra conexión
 * queda bloqueado esperando que la transacción haga COMMIT — causando timeouts.
 *
 * Con RCSI activado, los SELECT leen la versión "committed" de las filas
 * desde el tempdb (row versioning) sin necesitar S-locks, eliminando el bloqueo.
 */
require('dotenv').config();
const knex = require('knex');

const connection = {
  client: 'mssql',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'master', // Necesitamos conectarnos a master para alterar la BD
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      enableArithAbort: true
    }
  }
};

const dbName = process.env.DB_NAME || 'ensayo2027';

const db = knex(connection);

async function enableRCSI() {
  console.log(`\n🔧 Habilitando Read Committed Snapshot Isolation en "${dbName}"...`);

  try {
    // Paso 1: Verificar estado actual
    const result = await db.raw(`
      SELECT name, is_read_committed_snapshot_on
      FROM sys.databases
      WHERE name = '${dbName}'
    `);

    const row = result[0];
    if (!row) {
      throw new Error(`Base de datos "${dbName}" no encontrada.`);
    }

    if (row.is_read_committed_snapshot_on) {
      console.log(`✅ RCSI ya está habilitado en "${dbName}". No se requiere acción.`);
      return;
    }

    // Paso 2: Poner la BD en modo SINGLE_USER para poder alterar el nivel de aislamiento
    console.log(`   Poniendo "${dbName}" en modo SINGLE_USER...`);
    await db.raw(`ALTER DATABASE [${dbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE`);

    // Paso 3: Habilitar RCSI
    console.log(`   Habilitando READ_COMMITTED_SNAPSHOT...`);
    await db.raw(`ALTER DATABASE [${dbName}] SET READ_COMMITTED_SNAPSHOT ON`);

    // Paso 4: Regresar a modo MULTI_USER
    console.log(`   Regresando a modo MULTI_USER...`);
    await db.raw(`ALTER DATABASE [${dbName}] SET MULTI_USER`);

    // Paso 5: Verificar que quedó habilitado
    const verify = await db.raw(`
      SELECT name, is_read_committed_snapshot_on
      FROM sys.databases
      WHERE name = '${dbName}'
    `);

    if (verify[0]?.is_read_committed_snapshot_on) {
      console.log(`\n✅ RCSI habilitado exitosamente en "${dbName}".`);
      console.log(`   Los SELECT ya no bloquearán ni serán bloqueados por transacciones activas.\n`);
    } else {
      throw new Error('La verificación post-activación falló.');
    }

  } catch (err) {
    console.error(`\n❌ Error al habilitar RCSI: ${err.message}\n`);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

enableRCSI();
