const calificacionesRepository = require('../repositories/calificaciones.repository');
const participantesRepository = require('../repositories/participantes.repository');
const catalogosRepository = require('../repositories/catalogos.repository');
const bitacoraRepository = require('../repositories/bitacora.repository');

class JuezController {
  /**
   * Obtiene la lista de ensayos validados (anonimizados) listos para calificar
   */
  async getEnsayos(req, res) {
    try {
      const id_juez = req.user.id_usuario;
      const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
      if (!convocatoriaActiva) {
        return res.status(400).json({ error: 'No hay ninguna convocatoria activa en este momento.' });
      }

      const ensayos = await calificacionesRepository.getEnsayosValidadosParaJuez(
        convocatoriaActiva.id_convocatoria,
        id_juez
      );
      res.json(ensayos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Asigna una calificación al ensayo de un participante
   */
  async calificarEnsayo(req, res) {
    try {
      const id_juez = req.user.id_usuario;
      const {
        id_participante,
        califica1, // Formato (0.0 - 0.5)
        califica2, // Claridad (0.0 - 2.0)
        califica3, // Contenido (0.0 - 2.0)
        califica4, // Originalidad (0.0 - 2.0)
        califica5, // Estilo (0.0 - 2.0)
        califica6, // Conclusión (0.0 - 1.5)
        observaciones
      } = req.body;

      if (!id_participante) {
        return res.status(400).json({ error: 'El ID del participante es requerido.' });
      }

      // Convertir y validar cada ponderación
      const c1 = parseFloat(califica1);
      const c2 = parseFloat(califica2);
      const c3 = parseFloat(califica3);
      const c4 = parseFloat(califica4);
      const c5 = parseFloat(califica5);
      const c6 = parseFloat(califica6);

      if (isNaN(c1) || c1 < 0 || c1 > 0.5) return res.status(400).json({ error: 'Calificación de Formato inválida (Rango: 0.0 - 0.5).' });
      if (isNaN(c2) || c2 < 0 || c2 > 2.0) return res.status(400).json({ error: 'Calificación de Claridad inválida (Rango: 0.0 - 2.0).' });
      if (isNaN(c3) || c3 < 0 || c3 > 2.0) return res.status(400).json({ error: 'Calificación de Contenido inválida (Rango: 0.0 - 2.0).' });
      if (isNaN(c4) || c4 < 0 || c4 > 2.0) return res.status(400).json({ error: 'Calificación de Originalidad inválida (Rango: 0.0 - 2.0).' });
      if (isNaN(c5) || c5 < 0 || c5 > 2.0) return res.status(400).json({ error: 'Calificación de Estilo/Ortografía inválida (Rango: 0.0 - 2.0).' });
      if (isNaN(c6) || c6 < 0 || c6 > 1.5) return res.status(400).json({ error: 'Calificación de Conclusión inválida (Rango: 0.0 - 1.5).' });

      // Verificar que el participante exista y esté validado
      const participante = await participantesRepository.findById(id_participante);
      if (!participante) {
        return res.status(404).json({ error: 'Participante no encontrado.' });
      }

      if (participante.status_ensayo !== 1) {
        return res.status(400).json({ error: 'Únicamente se pueden evaluar ensayos que hayan sido previamente validados.' });
      }

      // Verificar si el juez ya calificó este ensayo
      const evaluacionPrevia = await calificacionesRepository.findByParticipanteAndJuez(id_participante, id_juez);
      if (evaluacionPrevia) {
        return res.status(400).json({ error: 'Ya has registrado una calificación para este ensayo anteriormente.' });
      }

      // Calcular total de forma segura
      const total = parseFloat((c1 + c2 + c3 + c4 + c5 + c6).toFixed(1));

      // Guardar calificación
      const nuevaCalificacion = await calificacionesRepository.create({
        id_participante,
        id_juez,
        califica1: c1,
        califica2: c2,
        califica3: c3,
        califica4: c4,
        califica5: c5,
        califica6: c6,
        total,
        observaciones: observaciones ? observaciones.trim() : null
      });

      // Registrar acción en la bitácora (anonimizada, guardamos folio e ID participante)
      await bitacoraRepository.registrar(
        id_juez,
        'CALIFICAR_ENSAYO',
        'calificaciones',
        nuevaCalificacion.id_calificacion,
        { id_participante, folio: participante.folio, total },
        req.ip
      ).catch(err => console.error('Error al registrar bitácora:', err.message));


      res.json({
        exito: true,
        total,
        mensaje: `Calificación asignada con éxito al ensayo ${participante.folio}. Total obtenido: ${total} puntos.`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new JuezController();
