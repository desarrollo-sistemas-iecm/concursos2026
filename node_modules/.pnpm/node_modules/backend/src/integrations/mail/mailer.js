const nodemailer = require('nodemailer');
const vars = require('../../config/vars');

let transporter;

if (vars.smtp.host) {
  transporter = nodemailer.createTransport({
    host: vars.smtp.host,
    port: vars.smtp.port,
    secure: false, // Puerto 25
    tls: {
      rejectUnauthorized: false
    },
    auth: vars.smtp.user && vars.smtp.pass ? {
      user: vars.smtp.user,
      pass: vars.smtp.pass
    } : undefined
  });
} else {
  // Modo desarrollo local: simulación e impresión en consola
  transporter = nodemailer.createTransport({
    jsonTransport: true
  });
  console.log('[MAILER] SMTP no configurado. Los correos se imprimirán en consola en formato JSON (jsonTransport).');
}

/**
 * 📩 Correo 1: Registro Exitoso y Entrega de Credenciales
 * @param {string} correo - Correo del participante
 * @param {string} usuario - Usuario de acceso
 * @param {string} contrasena - Contraseña temporal / definida
 * @param {string} nombreCompleto - Nombre completo del participante
 */
async function enviarBienvenida(correo, usuario, contrasena = null, nombreCompleto = '') {
  const mostrarContrasenaHtml = contrasena 
    ? `<p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;"><strong>Contraseña:</strong> <span style="font-family: monospace; font-size: 15px; color: #38bdf8; font-weight: bold;">${contrasena}</span></p>`
    : `<p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;"><strong>Contraseña:</strong> <span style="color: #0f172a; font-weight: bold;">La contraseña definida en tu registro</span></p>`;

  const mailOptions = {
    from: vars.smtp.from,
    to: correo,
    bcc: vars.smtp.bcc || 'concursos@iecm.mx',
    subject: 'Concurso de Ensayo 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: bold;">¡Bienvenido/a!</h2>
          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Instituto Electoral de la Ciudad de México</p>
        </div>
        
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hola <strong>${nombreCompleto || usuario}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Agradecemos sinceramente tu registro en el <strong>Concurso Juvenil de Ensayo 2026 “Conversando con los clásicos”</strong>.</p>
        
        <div style="background-color: #0f172a; border-radius: 8px; padding: 18px; margin: 24px 0; color: #ffffff;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: bold; uppercase; letter-spacing: 1px;">Credenciales de Acceso al Sistema</p>
          <p style="margin: 12px 0 0 0; color: #f8fafc; font-size: 14px;"><strong>Persona Usuaria:</strong> <span style="font-family: monospace; font-size: 15px; color: #38bdf8; font-weight: bold;">${usuario}</span></p>
          ${mostrarContrasenaHtml}
        </div>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; color: #0369a1; font-size: 13px; font-weight: bold;">📋 Aviso Importante:</p>
          <p style="margin: 4px 0 0 0; color: #334155; font-size: 13px; line-height: 1.4;">Asegúrate de contar con la documentación señalada en la Convocatoria previo al registro definitivo de tu obra.</p>
        </div>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:5173/login" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Iniciar sesión →</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Instituto Electoral de la Ciudad de México &copy; 2026-2027</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * 📩 Correo 2: Reenvío de Credenciales de Acceso
 * @param {string} correo - Correo del usuario
 * @param {string} usuario - Nombre de usuario
 * @param {string} contrasena - Contraseña
 * @param {string} nombreCompleto - Nombre completo
 */
async function enviarReenvioCredenciales(correo, usuario, contrasena = null, nombreCompleto = '') {
  const mostrarContrasenaHtml = contrasena 
    ? `<p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;"><strong>Contraseña:</strong> <span style="font-family: monospace; font-size: 15px; color: #0284c7; font-weight: bold;">${contrasena}</span></p>`
    : `<p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;"><strong>Contraseña:</strong> <span style="color: #0f172a; font-weight: bold;">(Registrada previamente)</span></p>`;

  const mailOptions = {
    from: vars.smtp.from,
    to: correo,
    bcc: vars.smtp.bcc || 'concursos@iecm.mx',
    subject: 'REENVÍO - Sistema de Registro de Concurso de Divulgacion',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 18px; font-weight: bold;">Concurso de Ensayo 2026</h2>
          <p style="color: #0284c7; font-size: 13px; font-weight: bold; margin: 4px 0 0 0;">Reenvío de Accesos al Sistema</p>
        </div>
        
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hola <strong>${nombreCompleto || usuario}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Atendiendo a tu solicitud, te reenviamos tus datos de acceso para ingresar a la plataforma:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Persona Usuaria:</strong> <span style="font-family: monospace; font-size: 15px; color: #0f172a; font-weight: bold;">${usuario}</span></p>
          ${mostrarContrasenaHtml}
        </div>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; color: #b45309; font-size: 13px; font-weight: bold;">🛡️ Aviso de Seguridad:</p>
          <p style="margin: 4px 0 0 0; color: #78350f; font-size: 13px; line-height: 1.4;">Te recomendamos guardar tus credenciales en un lugar seguro y cambiar tu contraseña tras ingresar.</p>
        </div>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:5173/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Iniciar sesión →</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Instituto Electoral de la Ciudad de México &copy; 2026-2027</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * 📩 Correo 3: Confirmación de Ensayo Validado (Asignación de Folio)
 * @param {string} correo - Correo del participante
 * @param {string} seudonimo - Seudónimo
 * @param {string} folio - Folio oficial
 * @param {string} urlDescargaAcuse - URL de descarga del acuse
 */
async function enviarEnsayoValidado(correo, seudonimo, folio, urlDescargaAcuse) {
  const mailOptions = {
    from: vars.smtp.from,
    to: correo,
    bcc: vars.smtp.bcc || 'concursos@iecm.mx',
    subject: 'Sistema de Registro de Concursos de Divulgacion',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #10b981; margin: 0; font-size: 20px; font-weight: bold;">✓ ¡Ensayo Validado!</h2>
          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Concurso Juvenil de Ensayo — Instituto Electoral de la CDMX</p>
        </div>
        
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Estimado/a participante con seudónimo <strong>${seudonimo}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Nos complace informarte que tu ensayo y documentación adjunta han sido **revisados y validados exitosamente**.</p>
        
        <div style="background-color: #f0fdf4; border: 2px dashed #10b981; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; color: #166534; font-size: 13px; font-weight: bold; uppercase; letter-spacing: 1px;">Número de Folio Oficial Asignado:</p>
          <p style="margin: 8px 0 0 0; font-family: monospace; font-size: 28px; color: #15803d; font-weight: 900; letter-spacing: 2px;">${folio}</p>
        </div>
        
        <p style="color: #475569; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
          Por favor conserva este Folio Oficial como tu comprobante definitivo de participación.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${urlDescargaAcuse}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">↓ Descargar acuse de registro</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Instituto Electoral de la Ciudad de México &copy; 2026-2027</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * 📩 Correo 4: Observaciones / Solicitud de Corrección de Ensayo
 * @param {string} correo - Correo del participante
 * @param {string} seudonimo - Seudónimo
 * @param {string} observaciones - Comentarios del dictamen
 */
async function enviarEnsayoObservado(correo, seudonimo, observaciones) {
  const mailOptions = {
    from: vars.smtp.from,
    to: correo,
    bcc: vars.smtp.bcc || 'concursos@iecm.mx',
    subject: 'Sistema de Registro de Concursos de Divulgacion',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #d97706; margin: 0; font-size: 20px; font-weight: bold;">⚠️ Revisión de documentos</h2>
          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Concurso Juvenil de Ensayo — Instituto Electoral de la CDMX</p>
        </div>
        
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Estimado/a participante con seudónimo <strong>${seudonimo}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Te informamos que durante la revisión de tu expediente se identificaron algunas inconsistencias u omisiones que requieren tu atención:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;">
              <th style="padding: 10px;">Documento</th>
              <th style="padding: 10px;">Estatus</th>
              <th style="padding: 10px;">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Ensayo Principal</td>
              <td style="padding: 10px;"><span style="color: #dc2626; font-weight: bold; background-color: #fee2e2; padding: 2px 8px; border-radius: 4px;">Incorrecto</span></td>
              <td style="padding: 10px; color: #b91c1c;">${observaciones}</td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: bold;">📝 Observaciones del Validador:</p>
          <p style="margin: 6px 0 0 0; color: #78350f; font-size: 13px; line-height: 1.5; white-space: pre-line;">${observaciones}</p>
        </div>
        
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">Por favor ingresa al sistema para corregir y subir nuevamente los archivos señalados.</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:5173/login" style="display: inline-block; background-color: #d97706; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Corregir documentos →</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Instituto Electoral de la Ciudad de México &copy; 2026-2027</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * 📩 Correo 5: Restablecimiento de Contraseña
 * @param {string} correo - Correo del usuario
 * @param {string} usuario - Nombre de usuario
 * @param {string} token - Token / Código de seguridad
 * @param {string} urlRestablecimiento - Enlace directo para restablecer
 */
async function enviarRecuperacionPassword(correo, usuario, token, urlRestablecimiento) {
  const mailOptions = {
    from: vars.smtp.from,
    to: correo,
    bcc: vars.smtp.bcc || 'concursos@iecm.mx',
    subject: 'Restablecimiento de Contraseña — IECM Concurso de Ensayo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #8C65AA; padding-bottom: 12px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: #32215C; margin: 0; font-size: 20px; font-weight: bold;">🔑 Restablecimiento de Contraseña</h2>
          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Instituto Electoral de la Ciudad de México</p>
        </div>
        
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hola <strong>${usuario}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en la plataforma del <strong>Concurso Juvenil de Ensayo 2026/2027</strong>.</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${urlRestablecimiento}" style="display: inline-block; background-color: #8C65AA; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px; shadow: 0 4px 12px rgba(140,101,170,0.3);">Restablecer mi Contraseña →</a>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">O utiliza este Código / Token de Seguridad:</p>
          <p style="margin: 8px 0 0 0; font-family: monospace; font-size: 22px; color: #32215C; font-weight: 900; letter-spacing: 3px;">${token}</p>
        </div>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; color: #b45309; font-size: 13px; font-weight: bold;">⏰ Este enlace expira en 30 minutos.</p>
          <p style="margin: 4px 0 0 0; color: #78350f; font-size: 12px; line-height: 1.4;">Si no realizaste esta solicitud, puedes ignorar este mensaje de forma segura; tu contraseña permanecerá sin cambios.</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Instituto Electoral de la Ciudad de México &copy; 2026-2027</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = {
  enviarBienvenida,
  enviarReenvioCredenciales,
  enviarEnsayoValidado,
  enviarEnsayoObservado,
  enviarRecuperacionPassword
};
