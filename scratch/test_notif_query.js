const db = require('../backend/src/config/db');

async function testNotif() {
  try {
    const rawNotifs = await db('notificaciones').select('*');
    console.log('Filas crudas en notificaciones:', rawNotifs);

    const rawLecturas = await db('notificaciones_lecturas').select('*');
    console.log('Filas crudas en notificaciones_lecturas:', rawLecturas);

    // Probar query del controlador
    const id_usuario = 10; // Usuario Alan (id_participante 6 es id_usuario 10)
    const id_tipousuario = 1;

    const list = await db('notificaciones as n')
      .leftJoin('notificaciones_lecturas as nl', function() {
        this.on('n.id_notificacion', '=', 'nl.id_notificacion')
            .andOn('nl.id_usuario', '=', db.raw('?', [id_usuario]));
      })
      .leftJoin('usuarios as u', 'n.id_remitente', 'u.id_usuario')
      .where(function() {
        this.where('n.id_usuario_destino', id_usuario)
            .orWhere('n.id_tipousuario_destino', id_tipousuario);
      })
      .select(
        'n.*',
        'u.nombre as remitente_nombre',
        'u.apellido_pat as remitente_apellido_pat',
        db.raw('ISNULL(nl.leido, 0) as leido'),
        'nl.fecha_leido'
      )
      .orderBy('n.fecha_alta', 'desc');

    console.log('Resultado de query corregida con leftJoin:', list);
  } catch (err) {
    console.error('ERROR EN QUERY NOTIF:', err);
  } finally {
    process.exit(0);
  }
}

testNotif();
