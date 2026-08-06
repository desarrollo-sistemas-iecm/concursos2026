const db = require('../config/db');

class NotificacionesService {
  /**
   * Crea una notificación persistida en la BD para un usuario o rol específico
   */
  async crearNotificacion({ id_remitente = null, id_usuario_destino = null, id_tipousuario_destino = null, tipo = 'sistema', asunto, mensaje }) {
    try {
      let insertedId;

      let targetUser = id_usuario_destino !== null && id_usuario_destino !== undefined && !isNaN(id_usuario_destino) ? parseInt(id_usuario_destino, 10) : null;
      let targetRole = id_tipousuario_destino !== null && id_tipousuario_destino !== undefined && !isNaN(id_tipousuario_destino) ? parseInt(id_tipousuario_destino, 10) : null;

      // Restriccion CK_notif_destino: solo uno de los dos puede ser no nulo
      if (targetUser !== null) {
        targetRole = null;
      } else if (targetRole !== null) {
        targetUser = null;
      }

      let senderUser = id_remitente !== null && id_remitente !== undefined && !isNaN(id_remitente) ? parseInt(id_remitente, 10) : null;

      let tipoNum = 1;
      if (typeof tipo === 'number') {
        tipoNum = tipo;
      } else if (tipo === 'observado' || tipo === 'advertencia' || tipo === 'rechazado') {
        tipoNum = 2;
      } else if (tipo === 'validado' || tipo === 'exito' || tipo === 'sistema') {
        tipoNum = 1;
      }

      await db.transaction(async (trx) => {
        const result = await trx.raw(
          `INSERT INTO [notificaciones] ([id_remitente], [id_tipousuario_destino], [id_usuario_destino], [tipo], [asunto], [mensaje], [status])
           OUTPUT INSERTED.[id_notificacion]
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [senderUser, targetRole, targetUser, tipoNum, asunto, mensaje]
        );

        insertedId = result[0]?.id_notificacion;

        if (targetUser && insertedId) {
          await trx.raw(
            `INSERT INTO [notificaciones_lecturas] ([id_notificacion], [id_usuario], [leido]) VALUES (?, ?, 0)`,
            [insertedId, targetUser]
          );
        }
      });

      return insertedId;
    } catch (err) {
      console.error('Error al crear notificación in-app:', err.message);
      return null;
    }
  }
}

module.exports = new NotificacionesService();
