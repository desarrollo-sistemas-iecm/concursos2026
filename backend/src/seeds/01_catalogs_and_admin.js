const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Eliminar en orden para respetar FK constraints
  await knex('bitacora_acciones').del();
  await knex('notificaciones_lecturas').del();
  await knex('notificaciones').del();
  await knex('auditoria_impersonacion').del();
  await knex('calificaciones').del();
  await knex('participante_manifestaciones').del();
  await knex('participantes').del();
  await knex('cat_manifestaciones').del();
  await knex('cat_te_enteraste').del();
  await knex('cat_alcaldias').del();
  await knex('cat_categorias').del();
  await knex('convocatorias').del();
  await knex('usuarios').del();
  await knex('cat_tipousuarios').del();

  // SQL Server no resetea IDENTITY con DELETE — hay que hacerlo explícitamente
  // RESEED, 0 → el próximo INSERT generará ID = 1
  await knex.raw('DBCC CHECKIDENT ([cat_tipousuarios], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([cat_alcaldias], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([cat_te_enteraste], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([cat_manifestaciones], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([convocatorias], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([cat_categorias], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([usuarios], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([participantes], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([calificaciones], RESEED, 0)');
  await knex.raw('DBCC CHECKIDENT ([notificaciones], RESEED, 0)');

  // 1. Seed cat_tipousuarios
  await knex('cat_tipousuarios').insert([
    { descripcion: 'Participante', status: 1 },
    { descripcion: 'Admin', status: 1 },
    { descripcion: 'Juez', status: 1 },
    { descripcion: 'Superadmin', status: 1 }
  ]);

  // 2. Seed cat_alcaldias
  await knex('cat_alcaldias').insert([
    { nombre: 'Álvaro Obregón', status: 1 },
    { nombre: 'Azcapotzalco', status: 1 },
    { nombre: 'Benito Juárez', status: 1 },
    { nombre: 'Coyoacán', status: 1 },
    { nombre: 'Cuajimalpa de Morelos', status: 1 },
    { nombre: 'Cuauhtémoc', status: 1 },
    { nombre: 'Gustavo A. Madero', status: 1 },
    { nombre: 'Iztacalco', status: 1 },
    { nombre: 'Iztapalapa', status: 1 },
    { nombre: 'La Magdalena Contreras', status: 1 },
    { nombre: 'Miguel Hidalgo', status: 1 },
    { nombre: 'Milpa Alta', status: 1 },
    { nombre: 'Tláhuac', status: 1 },
    { nombre: 'Tlalpan', status: 1 },
    { nombre: 'Venustiano Carranza', status: 1 },
    { nombre: 'Xochimilco', status: 1 },
    { nombre: 'Otro', status: 1 }
  ]);

  // 3. Seed cat_te_enteraste
  await knex('cat_te_enteraste').insert([
    { descripcion: 'Redes sociales (Facebook, Instagram, X/Twitter, TikTok)', status: 1 },
    { descripcion: 'Página web del IECM', status: 1 },
    { descripcion: 'Carteles / Volantes', status: 1 },
    { descripcion: 'Correo electrónico', status: 1 },
    { descripcion: 'Recomendación de un conocido / familiar', status: 1 },
    { descripcion: 'Profesor / Escuela', status: 1 },
    { descripcion: 'Otro', status: 1 }
  ]);

  // 4. Seed cat_manifestaciones
  await knex('cat_manifestaciones').insert([
    {
      texto: 'Manifiesto que conozco y acepto los términos establecidos en la convocatoria.',
      orden: 1,
      status: 1
    },
    {
      texto: 'Manifiesto, bajo protesta de decir verdad, que no soy persona funcionaria pública del IECM.',
      orden: 2,
      status: 1
    },
    {
      texto: 'Manifiesto, bajo protesta de decir verdad, que cumplo con la edad requerida en la convocatoria.',
      orden: 3,
      status: 1
    },
    {
      texto: 'Manifiesto, bajo protesta de decir verdad, que toda la información proporcionada es verídica.',
      orden: 4,
      status: 1
    },
    {
      texto: 'Manifiesto que el ensayo es una obra original, inédita, no publicada anteriormente y de autoría intelectual propia. También autorizo al Instituto para utilizar libre y gratuitamente el contenido total o parcial de la obra, para ser impreso en libro o en versión electrónica, gráfica, plástica, audiovisual, fotográfica u otro medio. Esta reproducción atenderá al cumplimiento de los fines institucionales del IECM en materia de divulgación de la cultura democrática y educación cívica, además, se otorgará el crédito autoral correspondiente.',
      orden: 5,
      status: 1
    },
    {
      texto: 'Manifiesto que leí el aviso de privacidad del sistema de registro de participantes en los concursos para la promoción de la participación ciudadana y divulgación de la cultura democrática.',
      orden: 6,
      status: 1
    },
    {
      texto: 'En caso de ser una de las personas ganadoras, autorizo que el área editorial del IECM me contacte, si es necesario, durante el proceso de edición.',
      orden: 7,
      status: 1
    }
  ]);

  // 5. Seed convocatorias
  // OUTPUT INSERTED garantiza el ID en la misma query, sin depender de SCOPE_IDENTITY() ni .returning()
  const convResult = await knex.raw(`
    INSERT INTO [convocatorias] ([anio], [nombre], [fecha_inicio], [fecha_fin], [status])
    OUTPUT INSERTED.[id_convocatoria]
    VALUES (2027, N'Concurso Juvenil de Ensayo 2027', '2027-01-01', '2027-12-31', 1)
  `);
  const idConvocatoria = convResult[0]?.id_convocatoria;


  // 6. Seed cat_categorias (linked to the new Convocatoria)
  await knex('cat_categorias').insert([
    {
      id_convocatoria: idConvocatoria,
      nombre: 'Categoría 1 (15 a 17 años)',
      edad_min: 15,
      edad_max: 17,
      status: 1
    },
    {
      id_convocatoria: idConvocatoria,
      nombre: 'Categoría 2 (18 a 23 años)',
      edad_min: 18,
      edad_max: 23,
      status: 1
    }
  ]);

  // 7. Seed superadmin account
  const rawPassword = process.env.SEED_SUPERADMIN_PASSWORD;
  if (!rawPassword) {
    throw new Error('ERROR CRÍTICO: No se puede crear la cuenta de Superadmin sin la variable SEED_SUPERADMIN_PASSWORD definida en el archivo .env.');
  }
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await knex('usuarios').insert({
    id_tipousuario: 4, // Superadmin role
    nombre: 'Superadmin',
    apellido_pat: 'Sistema',
    apellido_mat: 'IECM',
    correo: 'admin@iecm.mx',
    usuario: 'admin',
    contrasena: hashedPassword,
    status: 1
  });

  console.log(`[SEED] Catálogos, convocatoria 2027 y Superadmin ('admin') creados con éxito.`);
};
