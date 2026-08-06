# Sistema de Gestión de Concursos e Iniciativas Institucionales — IECM

**Plataforma Oficial para la Administración de Concursos y Certámenes Institucionales**  
*Instituto Electoral de la Ciudad de México (IECM)*

---

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Perfiles de Usuario y Funcionalidades](#perfiles-de-usuario-y-funcionalidades)
4. [Mapeo de Rutas y Navegación](#mapeo-de-rutas-y-navegación)
5. [Manejo de Ambientes y Variables de Entorno](#manejo-de-ambientes-y-variables-de-entorno)
6. [Sistema de Logs y Auditoría](#sistema-de-logs-y-auditoría)
7. [Guía de Compilación y Despliegue](#guía-de-compilación-y-despliegue)
8. [Créditos](#créditos)

---

## Descripción General

El **Sistema de Gestión de Concursos del IECM** es una solución web integral, modular y dinámicamente adaptable diseñada para administrar diversos certámenes, concursos e iniciativas institucionales organizadas por el Instituto Electoral de la Ciudad de México (tales como Hackatones, Concursos de Ensayo, Certámenes de Innovación Tecnológica o Proyectos Juveniles).

La plataforma gestiona el ciclo de vida completo de cada certamen: desde el registro público de participantes o equipos, la recepción y dictamen de proyectos y documentación digital, la asignación automática de folios oficiales, la evaluación anónima por parte de jurados calificadores, hasta la administración ejecutiva en tiempo real.

---

## Stack Tecnológico

### Frontend
* **Framework**: Vue.js 3 (Composition API / `<script setup>`)
* **Bundler & Dev Server**: Vite 5 (con compilación multi-entorno)
* **Estilos & Diseño**: Tailwind CSS + Vanilla CSS (Glassmorphism, Neon Lights, Modos Claro / Oscuro)
* **Gestión de Estado**: Pinia
* **Enrutamiento**: Vue Router 4 (Guardián de navegación por roles y estado de autenticación)
* **Notificaciones & UI Modals**: SweetAlert2 (diseño adaptado a la identidad corporativa)
* **Animaciones**: GSAP (GreenSock Animation Platform)
* **Sockets Client**: Socket.io-client (Sincronización en tiempo real)

### Backend
* **Entorno de Ejecución**: Node.js v24+
* **Framework HTTP**: Express.js
* **SQL Query Builder / ORM**: Knex.js
* **Base de Datos**: Microsoft SQL Server (`mssql`)
* **Autenticación**: JSON Web Tokens (JWT) con control de Sesión Única por Base de Datos
* **Sockets Server**: Socket.io (Monitoreo en tiempo real y desconexión física forzada)
* **Seguridad de Contraseñas**: `bcryptjs`
* **Procesamiento de Archivos**: Multer (validación MIME de archivos adjuntos PDF/DOCX/Zip)
* **Envío de Correos**: Nodemailer (Transporter SMTP con plantillas HTML institucionales)
* **Sistema de Logs**: Winston (Salida coloreada ANSI en consola y transporte a archivos estructurados en `/logs`)

---

## Perfiles de Usuario y Funcionalidades

### 1. Participante (Rol 1)
* **Registro de Cuenta**: Validaciones estrictas en tiempo real:
  * CURP oficial validada según estándar RENAPO (18 caracteres).
  * Teléfono fijo y celular a 10 dígitos.
  * Contraseñas de 8 a 10 caracteres con inclusión obligatoria de especiales permitidos (`. , ! -`).
  * Validación estricta de suma Antispam.
* **Recuperación y Restablecimiento de Contraseña**:
  * **Vía Correo Electrónico**: Generación de token temporal (30 min) y envío de correo con enlace mágico interactivo.
  * **Vía Token / Código**: Ingreso directo de código de seguridad de 8 caracteres.
* **Registro de Proyectos, Obras y Expediente Digital**:
  * Carga del Proyecto o Trabajo Principal (PDF, Prototipos, Documentación técnica o Ensayos).
  * Carga de documentación soporte (INE / Identificación Oficial, Comprobante de Domicilio, Carta Manifestación con firma autógrafa).
  * Categorización automática según las reglas y parámetros de la convocatoria activa.
* **Seguimiento del Trámite**:
  * Línea de tiempo interactiva de avance (*Registrado*, *En Revisión*, *Validado*, *Con Observaciones*).
  * Corrección de documentos observados por el dictaminador.
  * Generación y descarga de **Acuse Oficial de Registro con Folio Asignado**.

---

### 2. Validador / Dictaminador (Rol 2)
* **Panel de Revisión de Expedientes**:
  * Visualización y descarga de proyectos, obras y anexos de participantes asignados.
  * Verificación de cumplimiento de requisitos de la Convocatoria vigente.
* **Dictaminación de Solicitudes**:
  * **Aprobación**: Genera automáticamente el **Número de Folio Oficial** correlativo y envía el correo con la asignación.
  * **Observación**: Permite enviar comentarios de corrección detallados; notifica por correo electrónico al participante para su subsanación.
* **Módulo de Reportería**: Exportación de datos de validación a formatos PDF y Excel.

---

### 3. Juez / Jurado Calificador (Rol 3)
* **Evaluación Anónima**:
  * Acceso exclusivo a los proyectos y obras validadas sin revelación de datos personales del participante (cumplimiento de confidencialidad y imparcialidad).
* **Cédula de Calificación**:
  * Formulario cuantitativo y cualitativo según rúbrica oficial definida para el certamen.
  * Registro de observaciones y puntaje final.

---

### 4. Superadmin (Rol 4)
* **Gestión Multiconcurso y Convocatorias**:
  * Creación y edición de convocatorias por tipo y año (Hackatones, Ensayos, Certámenes de Innovación; definiendo Nombre, Lema, Fechas de Inicio/Fin, Estado Activo/Inactivo).
* **Control de Sesiones y Monitoreo en Tiempo Real**:
  * Dashboard de usuarios conectados en tiempo real mediante WebSockets.
  * **Expulsión Remota / Cierre de Sesión Forzado**: Desconexión física instantánea de usuarios específicos o masiva global.
* **Suplantación de Identidad (Impersonación)**:
  * Permite ingresar temporalmente a la vista de cualquier participante para brindarle soporte técnico directo sin requerir su contraseña, con capacidad de regresar a la sesión de Superadmin en un clic.
* **Gestión del Tema e Identidad**:
  * Control del modo visual por omisión (Modo Claro / Modo Oscuro) y personalización estética según la imagen del certamen.
* **Módulo de Reportería General & Auditoría**:
  * Registros detallados de auditoría (*LOGINS*, *LOGOUTS*, *CARGA_ARCHIVOS*, *DICTAMENES*).
  * Reportería exportable a Excel y PDF.

---

## Mapeo de Rutas y Navegación

### Rutas Públicas
| Ruta | Descripción |
| :--- | :--- |
| `/` | Landing Page parametrizable con información de la Convocatoria Activa |
| `/login` | Inicio de Sesión de Usuarios |
| `/registro` | Formulario de Registro de Participantes |
| `/restablecer-password` | Interfaz de Restablecimiento de Contraseña mediante Token |

### Rutas Privadas (Requieren Autenticación)
| Ruta | Rol Permitido | Descripción |
| :--- | :--- | :--- |
| `/home` | Todos | Redirección automática inteligente según el rol |
| `/perfil` | Todos | Consulta y edición del perfil del usuario |
| `/participante/dashboard` | Participante (1) | Panel principal del concursante y registro de proyecto/obra |
| `/admin/validacion` | Validador (2), Superadmin (4) | Panel de dictamen de expedientes y folios |
| `/admin/reporteria` | Validador (2), Superadmin (4) | Módulo de reportes y descargas de folios |
| `/juez/evaluacion` | Juez (3) | Panel de lectura y calificación anónima de proyectos |
| `/superadmin/usuarios` | Superadmin (4) | Administración de cuentas, sesiones y soporte |
| `/superadmin/convocatorias` | Superadmin (4) | Configuración de certámenes y fechas |
| `/superadmin/manifestaciones` | Superadmin (4) | Catálogo de declaraciones juradas |
| `/superadmin/notificaciones` | Superadmin (4) | Envío de avisos y notificaciones push |
| `/superadmin/estadisticas` | Superadmin (4) | Gráficas e indicadores globales de participación |
| `/superadmin/reporteria` | Superadmin (4) | Módulo de reportería general ejecutiva |
| `/superadmin/tema` | Superadmin (4) | Personalización visual del portal |

---

## Manejo de Ambientes y Variables de Entorno

El sistema cuenta con una arquitectura multi-entorno dinámica configurada tanto en backend como en frontend:

### Archivos de Configuración Backend
* `backend/.env.development`: Entorno local de desarrollo (`NODE_ENV=development`).
* `backend/.env.production`: Entorno de producción (`NODE_ENV=production`).
* `backend/src/config/env.js`: Cargador centralizado que selecciona variables de base de datos, puertos (`3005` / `3000`) y llaves JWT.

### Archivos de Configuración Frontend
* `frontend/.env.development`: `VITE_API_URL=http://localhost:3005/api`
* `frontend/.env.staging`: `VITE_BASE_PATH=/hackaton2026/`, `VITE_API_URL=http://145.0.40.48:3005/api`
* `frontend/.env.production`: `VITE_BASE_PATH=/Ensayo2027/`, `VITE_API_URL=http://145.0.40.48:3000/api`

---

## Sistema de Logs y Auditoría

Centralizado en `backend/src/config/logger.js` a través de Winston:

1. **Terminal / Consola**:
   * Formateo en tiempo real con códigos de color ANSI para identificación visual inmediata:
     * `SESIÓN`: Logins y Logouts de usuarios (Verde).
     * `ACCIÓN`: Registros, ediciones y operaciones principales (Azul).
     * `CONSULT`: Consultas a catálogos e información (Cian).
     * `AVISO`: Advertencias y estados preventivos (Amarillo).
     * `ERROR`: Excepciones y fallos en controladores (Rojo).
     * `SYSTEM`: Inicializaciones del servidor e infraestructura (Púrpura).

2. **Transports de Archivo (Persistencia)**:
   * `backend/logs/error.log`: Registra únicamente errores de nivel `error`.
   * `backend/logs/activity.log`: Registra acciones y sesiones de usuarios.
   * `backend/logs/combined.log`: Registro histórico completo de eventos.

---

## Guía de Compilación y Despliegue

### 1. Instalación de Dependencias
```bash
# En el directorio raíz del proyecto o en backend/frontend:
pnpm install
```

### 2. Servidores de Desarrollo
```bash
# Ejecutar Backend (Express + Winston + WebSockets):
cd backend
pnpm run dev

# Ejecutar Frontend (Vite HMR):
cd frontend
pnpm run dev
```

### 3. Scripts de Compilación Frontend Multi-Entorno
```bash
# Compilación para Servidor de Desarrollo / Staging (/hackaton2026/):
cd frontend
pnpm run build:desarrollo

# Compilación para Servidor de Producción Oficial (/Ensayo2027/):
cd frontend
pnpm run build:produccion
```
> *Nota: Los scripts de compilación copian automáticamente el bundle optimizado de Vite hacia la carpeta `backend/public/`, listos para ser servidos de forma estática por Express.*

### 4. Ejecución del Servidor Backend (Producción/Servidor 48)
```bash
cd backend
node src/server.js
```

---

## Créditos

Desarrollado y construido para el Instituto Electoral de la Ciudad de México.

**Creado por Bruno Corona**
