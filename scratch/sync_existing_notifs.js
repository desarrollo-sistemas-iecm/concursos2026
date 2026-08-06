const db = require('../backend/src/config/db');
const notificacionesService = require('../backend/src/services/notificaciones.service');

async function sync() {
  try {
    const participantes = await db('participantes as p')
      .join('usuarios as u', 'p.id_usuario', 'u.id_usuario')
      .whereIn('p.status_ensayo', [1, 2]);

    console.log(`Encontrados ${participantes.length} participantes con dictamen activo.`);

    for (const p of participantes) {
      const idUsuario = parseInt(p.id_usuario, 10);
      // Verificar si ya existe una notificacion para este usuario
      const existe = await db('notificaciones')
        .where('id_usuario_destino', idUsuario)
        .first();

      if (!existe) {
        if (p.status_ensayo === 1) {
          await notificacionesService.crearNotificacion({
            id_remitente: p.id_validador ? parseInt(p.id_validador, 10) : null,
            id_usuario_destino: idUsuario,
            tipo: 'validado',
            asunto: '✓ ¡Tu ensayo ha sido validado exitosamente!',
            mensaje: `¡Felicidades! Tu obra "${p.titulo_ensayo || 'Ensayo'}" ha sido revisada y aprobada por el validador. Se te ha asignado el Folio Oficial ${p.folio || 'CE1-1'}. Tu comprobante de registro ya se encuentra listo para descarga en tu panel.`
          });
          console.log(`Notificación de validación creada para usuario ID ${idUsuario}`);
        } else if (p.status_ensayo === 2) {
          await notificacionesService.crearNotificacion({
            id_remitente: p.id_validador ? parseInt(p.id_validador, 10) : null,
            id_usuario_destino: idUsuario,
            tipo: 'observado',
            asunto: '⚠️ Tu ensayo requiere corrección',
            mensaje: `Durante la revisión de tu expediente se registraron las siguientes observaciones: "${(p.observaciones || 'Favor de revisar tu ensayo').trim()}". Por favor dirígete a tu panel para volver a subir tu documento corregido.`
          });
          console.log(`Notificación de observaciones creada para usuario ID ${idUsuario}`);
        }
      }
    }
  } catch (err) {
    console.error('ERROR EN SYNC:', err);
  } finally {
    process.exit(0);
  }
}

sync();
