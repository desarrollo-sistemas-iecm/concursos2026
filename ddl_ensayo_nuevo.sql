/* ============================================================
   ESQUEMA NUEVO - SISTEMA CONCURSO DE ENSAYO (MULTI-EDICION)
   Motor: SQL Server
   ============================================================ */

/* ------------------------------------------------------------
   1. CATALOGO: TIPOS DE USUARIO (roles)
   1 = Participante | 2 = Admin (validador) | 3 = Juez | 4 = Superadmin
   ------------------------------------------------------------ */
CREATE TABLE cat_tipousuarios (
    id_tipousuario  int IDENTITY(1,1)   NOT NULL,
    descripcion     varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    status          smallint     NOT NULL DEFAULT 1,
    fecha_alta      datetime2    NOT NULL DEFAULT GETDATE(),
    fecha_modifica  datetime2    NULL,
    fecha_baja      datetime2    NULL,
    CONSTRAINT PK_cat_tipousuarios PRIMARY KEY (id_tipousuario)
);
GO

/* ------------------------------------------------------------
   2. USUARIOS (cuenta, estable entre ediciones del concurso)
   ------------------------------------------------------------ */
CREATE TABLE usuarios (
    id_usuario          int IDENTITY(1,1)  NOT NULL,
    id_tipousuario      int                NOT NULL,
    nombre              varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    apellido_pat        varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    apellido_mat        varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    curp                varchar(18)  COLLATE Modern_Spanish_CI_AS NULL,
    genero              varchar(10)  COLLATE Modern_Spanish_CI_AS NULL,
    fecha_nacimiento     date               NULL,
    correo              varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    usuario             varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    contrasena          varchar(255) COLLATE Modern_Spanish_CI_AS NOT NULL, -- almacenar hash (bcrypt/argon2), no texto plano
    telefono_casa       varchar(15)  COLLATE Modern_Spanish_CI_AS NULL,
    celular_personal    varchar(15)  COLLATE Modern_Spanish_CI_AS NULL,
    id_distrito         int                NULL,
    session_id          varchar(255) COLLATE Modern_Spanish_CI_AS NULL, -- token de sesion activa (single-login)
    status              smallint           NOT NULL DEFAULT 1, -- 1 = activo, 0 = inactivo
    fecha_alta          datetime2          NOT NULL DEFAULT GETDATE(),
    fecha_modifica      datetime2          NULL,
    fecha_baja          datetime2          NULL,
    CONSTRAINT PK_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT FK_usuarios_tipousuario FOREIGN KEY (id_tipousuario)
        REFERENCES cat_tipousuarios (id_tipousuario),
    CONSTRAINT UQ_usuarios_usuario UNIQUE (usuario),
    CONSTRAINT UQ_usuarios_correo UNIQUE (correo),
    CONSTRAINT UQ_usuarios_curp UNIQUE (curp)
);
GO

/* ------------------------------------------------------------
   3. CONVOCATORIAS (ediciones del concurso: 2026, 2027, ...)
   ------------------------------------------------------------ */
CREATE TABLE convocatorias (
    id_convocatoria  int IDENTITY(1,1)  NOT NULL,
    anio             int                NOT NULL,
    nombre           varchar(150) COLLATE Modern_Spanish_CI_AS NOT NULL,
    fecha_inicio     date               NOT NULL,
    fecha_fin        date               NOT NULL,
    status           smallint           NOT NULL DEFAULT 1, -- 1 = activa, 0 = cerrada
    fecha_alta       datetime2          NOT NULL DEFAULT GETDATE(),
    fecha_modifica   datetime2          NULL,
    CONSTRAINT PK_convocatorias PRIMARY KEY (id_convocatoria),
    CONSTRAINT UQ_convocatorias_anio UNIQUE (anio)
);
GO

/* ------------------------------------------------------------
   4. CATEGORIAS POR CONVOCATORIA (rangos de edad configurables)
   ------------------------------------------------------------ */
CREATE TABLE cat_categorias (
    id_categoria     int IDENTITY(1,1)  NOT NULL,
    id_convocatoria  int                NOT NULL,
    nombre           varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL, -- ej. "15 a 17 años"
    edad_min         smallint           NOT NULL,
    edad_max         smallint           NOT NULL,
    status           smallint           NOT NULL DEFAULT 1,
    CONSTRAINT PK_cat_categorias PRIMARY KEY (id_categoria),
    CONSTRAINT FK_categorias_convocatoria FOREIGN KEY (id_convocatoria)
        REFERENCES convocatorias (id_convocatoria),
    CONSTRAINT CK_categorias_rango CHECK (edad_max >= edad_min)
);
GO

/* ------------------------------------------------------------
   5. CATALOGO: ALCALDIAS / DEMARCACIONES
   ------------------------------------------------------------ */
CREATE TABLE cat_alcaldias (
    id_alcaldia  int IDENTITY(1,1)  NOT NULL,
    nombre       varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL,
    status       smallint           NOT NULL DEFAULT 1,
    CONSTRAINT PK_cat_alcaldias PRIMARY KEY (id_alcaldia)
);
GO

/* ------------------------------------------------------------
   6. CATALOGO: COMO TE ENTERASTE
   ------------------------------------------------------------ */
CREATE TABLE cat_te_enteraste (
    id_te_enteraste  int IDENTITY(1,1)  NOT NULL,
    descripcion      varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL,
    status           smallint           NOT NULL DEFAULT 1,
    CONSTRAINT PK_cat_te_enteraste PRIMARY KEY (id_te_enteraste)
);
GO

/* ------------------------------------------------------------
   7. CATALOGO: MANIFESTACIONES (declaraciones bajo protesta)
   ------------------------------------------------------------ */
CREATE TABLE cat_manifestaciones (
    id_manifestacion  int IDENTITY(1,1)  NOT NULL,
    texto             varchar(1000) COLLATE Modern_Spanish_CI_AS NOT NULL,
    orden             smallint            NOT NULL,
    status            smallint            NOT NULL DEFAULT 1,
    CONSTRAINT PK_cat_manifestaciones PRIMARY KEY (id_manifestacion)
);
GO

/* ------------------------------------------------------------
   8. PARTICIPANTES (participación de un usuario en una convocatoria)
   ------------------------------------------------------------ */
CREATE TABLE participantes (
    id_participante       int IDENTITY(1,1)  NOT NULL,
    id_usuario            int                NOT NULL,
    id_convocatoria       int                NOT NULL,
    id_categoria          int                NULL,
    id_alcaldia           int                NULL,
    id_te_enteraste       int                NULL,
    id_validador          int                NULL,  -- FK a usuarios (admin que validó)
    folio                 varchar(30)  COLLATE Modern_Spanish_CI_AS NULL,
    seudonimo             varchar(50)  COLLATE Modern_Spanish_CI_AS NOT NULL,
    titulo_ensayo         varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL,
    obra                  varchar(500) COLLATE Modern_Spanish_CI_AS NOT NULL,
    entidad               varchar(200) COLLATE Modern_Spanish_CI_AS NULL, -- solo si alcaldia = "Otro"
    soy_originario        bit                NULL,
    archivo_ensayo        varchar(255) COLLATE Modern_Spanish_CI_AS NULL,
    status_ensayo         smallint           NOT NULL DEFAULT 0, -- 0 pendiente, 1 validado, 2 con observaciones
    observaciones         varchar(800) COLLATE Modern_Spanish_CI_AS NULL,
    nombre_tutor          varchar(50)  COLLATE Modern_Spanish_CI_AS NULL,
    apellido_pat_tutor    varchar(50)  COLLATE Modern_Spanish_CI_AS NULL,
    apellido_mat_tutor    varchar(50)  COLLATE Modern_Spanish_CI_AS NULL,
    clave_elector_tutor   varchar(18)  COLLATE Modern_Spanish_CI_AS NULL,
    tel1                  varchar(15)  COLLATE Modern_Spanish_CI_AS NULL,
    tel2                  varchar(15)  COLLATE Modern_Spanish_CI_AS NULL,
    fecha_alta            datetime2          NOT NULL DEFAULT GETDATE(),
    fecha_modifica        datetime2          NULL,
    CONSTRAINT PK_participantes PRIMARY KEY (id_participante),
    CONSTRAINT FK_participantes_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario),
    CONSTRAINT FK_participantes_convocatoria FOREIGN KEY (id_convocatoria)
        REFERENCES convocatorias (id_convocatoria),
    CONSTRAINT FK_participantes_categoria FOREIGN KEY (id_categoria)
        REFERENCES cat_categorias (id_categoria),
    CONSTRAINT FK_participantes_alcaldia FOREIGN KEY (id_alcaldia)
        REFERENCES cat_alcaldias (id_alcaldia),
    CONSTRAINT FK_participantes_te_enteraste FOREIGN KEY (id_te_enteraste)
        REFERENCES cat_te_enteraste (id_te_enteraste),
    CONSTRAINT FK_participantes_validador FOREIGN KEY (id_validador)
        REFERENCES usuarios (id_usuario),
    -- Un usuario no puede registrarse dos veces en la misma convocatoria
    CONSTRAINT UQ_participantes_usuario_convocatoria UNIQUE (id_usuario, id_convocatoria),
    -- El folio debe ser único dentro de toda la BD (o cambiar a (folio, id_convocatoria) si se reinicia cada año)
    CONSTRAINT UQ_participantes_folio UNIQUE (folio)
);
GO

/* ------------------------------------------------------------
   9. RESPUESTAS A MANIFESTACIONES (tabla puente)
   ------------------------------------------------------------ */
CREATE TABLE participante_manifestaciones (
    id_participante    int       NOT NULL,
    id_manifestacion   int       NOT NULL,
    respuesta          smallint  NOT NULL, -- 1 = Sí, bajo protesta de decir verdad
    fecha_alta         datetime2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_participante_manifestaciones PRIMARY KEY (id_participante, id_manifestacion),
    CONSTRAINT FK_partmanif_participante FOREIGN KEY (id_participante)
        REFERENCES participantes (id_participante),
    CONSTRAINT FK_partmanif_manifestacion FOREIGN KEY (id_manifestacion)
        REFERENCES cat_manifestaciones (id_manifestacion)
);
GO

/* ------------------------------------------------------------
   10. CALIFICACIONES (una fila por juez que califica un ensayo)
   ------------------------------------------------------------ */
CREATE TABLE calificaciones (
    id_calificacion   int IDENTITY(1,1)  NOT NULL,
    id_participante   int                NOT NULL,
    id_juez           int                NOT NULL,
    califica1         decimal(4,1)       NOT NULL, -- Formato            0.0 - 0.5
    califica2         decimal(4,1)       NOT NULL, -- Claridad           0.0 - 2.0
    califica3         decimal(4,1)       NOT NULL, -- Contenido          0.0 - 2.0
    califica4         decimal(4,1)       NOT NULL, -- Originalidad       0.0 - 2.0
    califica5         decimal(4,1)       NOT NULL, -- Estilo/ortografia  0.0 - 2.0
    califica6         decimal(4,1)       NOT NULL, -- Conclusion         0.0 - 1.5
    total             decimal(4,1)       NOT NULL, -- suma de califica1..6, calculado en app antes de insertar
    observaciones     nvarchar(500)      NULL,
    fecha_alta        datetime2          NOT NULL DEFAULT GETDATE(),
    fecha_modifica    datetime2          NULL,
    CONSTRAINT PK_calificaciones PRIMARY KEY (id_calificacion),
    CONSTRAINT FK_calificaciones_participante FOREIGN KEY (id_participante)
        REFERENCES participantes (id_participante),
    CONSTRAINT FK_calificaciones_juez FOREIGN KEY (id_juez)
        REFERENCES usuarios (id_usuario),
    -- Un mismo juez no puede calificar dos veces el mismo ensayo
    CONSTRAINT UQ_calificaciones_participante_juez UNIQUE (id_participante, id_juez)
);
GO

/* ============================================================
   VISTA: PROMEDIO Y CONTEO DE CALIFICACIONES POR PARTICIPANTE
   Nota: se usa ROUND(x, 1, 1) para TRUNCAR a 1 decimal (no redondear),
   replicando el comportamiento del sistema anterior para no alterar
   calificaciones ya calculadas al migrar datos históricos.
   ============================================================ */
CREATE VIEW vw_calificaciones AS
SELECT
    id_participante,
    ROUND(AVG(total), 1, 1)   AS prom_global,
    COUNT(*)                  AS jueces_que_calificaron,
    MIN(fecha_alta)           AS fecha_alta,
    MAX(fecha_modifica)       AS fecha_modifica
FROM calificaciones
GROUP BY id_participante;
GO

/* ============================================================
   11. CLAVE DE EMERGENCIA (acceso maestro, solo superadmin)
   ADVERTENCIA: esta clave, al ser plana, permite entrar a CUALQUIER
   cuenta. Restringir el permiso SELECT sobre esta tabla únicamente
   al rol/login de superadmin a nivel de base de datos (no solo a
   nivel de aplicación), y rotarla periódicamente.
   ============================================================ */
CREATE TABLE config_sistema (
    id_config           int IDENTITY(1,1)  NOT NULL,
    clave_emergencia    varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL, -- texto plano, por decisión explícita
    activa              bit                NOT NULL DEFAULT 1,
    fecha_modifica      datetime2          NOT NULL DEFAULT GETDATE(),
    id_usuario_modifico int                NULL, -- quién la cambió por última vez
    CONSTRAINT PK_config_sistema PRIMARY KEY (id_config),
    CONSTRAINT FK_config_sistema_usuario FOREIGN KEY (id_usuario_modifico)
        REFERENCES usuarios (id_usuario)
);
GO

/* ------------------------------------------------------------
   12. AUDITORIA DE USO DE LA CLAVE DE EMERGENCIA
   Registra cada vez que alguien entra a una cuenta ajena con la
   clave maestra: quién la usó, a qué cuenta entró, cuándo y desde
   dónde.
   ------------------------------------------------------------ */
CREATE TABLE auditoria_acceso_emergencia (
    id_auditoria        int IDENTITY(1,1)  NOT NULL,
    id_usuario_superadmin int              NOT NULL, -- quién usó la clave
    id_usuario_afectado   int              NOT NULL, -- a qué cuenta entró
    fecha_uso           datetime2          NOT NULL DEFAULT GETDATE(),
    ip_origen           varchar(45)  COLLATE Modern_Spanish_CI_AS NULL,
    CONSTRAINT PK_auditoria_acceso_emergencia PRIMARY KEY (id_auditoria),
    CONSTRAINT FK_auditoria_superadmin FOREIGN KEY (id_usuario_superadmin)
        REFERENCES usuarios (id_usuario),
    CONSTRAINT FK_auditoria_afectado FOREIGN KEY (id_usuario_afectado)
        REFERENCES usuarios (id_usuario)
);
GO

/* ============================================================
   11. AUDITORIA DE IMPERSONACION
   Permite al superadmin "entrar como" cualquier usuario sin
   conocer ni almacenar su contraseña real. Cada uso queda
   registrado para trazabilidad.
   ============================================================ */
CREATE TABLE auditoria_impersonacion (
    id_impersonacion   int IDENTITY(1,1)  NOT NULL,
    id_superadmin      int                NOT NULL, -- quien impersona
    id_usuario_target  int                NOT NULL, -- a quien impersona
    motivo             varchar(255) COLLATE Modern_Spanish_CI_AS NULL,
    ip_origen          varchar(45)  COLLATE Modern_Spanish_CI_AS NULL,
    fecha_inicio       datetime2          NOT NULL DEFAULT GETDATE(),
    fecha_fin          datetime2          NULL, -- NULL mientras la sesion sigue activa
    CONSTRAINT PK_auditoria_impersonacion PRIMARY KEY (id_impersonacion),
    CONSTRAINT FK_impersonacion_superadmin FOREIGN KEY (id_superadmin)
        REFERENCES usuarios (id_usuario),
    CONSTRAINT FK_impersonacion_target FOREIGN KEY (id_usuario_target)
        REFERENCES usuarios (id_usuario)
);
GO

/* ============================================================
   12. NOTIFICACIONES (bidireccional: broadcast por rol o
   dirigida a una persona; sirve tanto para avisos del
   superadmin como para solicitudes que un usuario le hace)
   ============================================================ */
CREATE TABLE notificaciones (
    id_notificacion             int IDENTITY(1,1)  NOT NULL,
    id_remitente                int                NOT NULL, -- quien la envia
    id_tipousuario_destino      int                NULL,      -- broadcast por rol (ej. todos los jueces)
    id_usuario_destino          int                NULL,      -- dirigida a una persona especifica
    tipo                        smallint           NOT NULL,  -- 1 = notificacion informativa, 2 = solicitud
    asunto                      varchar(150) COLLATE Modern_Spanish_CI_AS NOT NULL,
    mensaje                     varchar(1000) COLLATE Modern_Spanish_CI_AS NOT NULL,
    status                      smallint           NOT NULL DEFAULT 1, -- 1 = pendiente, 2 = atendida (aplica a solicitudes)
    fecha_alta                  datetime2          NOT NULL DEFAULT GETDATE(),
    fecha_atendida               datetime2          NULL,
    CONSTRAINT PK_notificaciones PRIMARY KEY (id_notificacion),
    CONSTRAINT FK_notif_remitente FOREIGN KEY (id_remitente)
        REFERENCES usuarios (id_usuario),
    CONSTRAINT FK_notif_tipousuario_destino FOREIGN KEY (id_tipousuario_destino)
        REFERENCES cat_tipousuarios (id_tipousuario),
    CONSTRAINT FK_notif_usuario_destino FOREIGN KEY (id_usuario_destino)
        REFERENCES usuarios (id_usuario),
    -- debe tener un destino: por rol (broadcast) o por usuario especifico, no ambos ni ninguno
    CONSTRAINT CK_notif_destino CHECK (
        (id_tipousuario_destino IS NOT NULL AND id_usuario_destino IS NULL)
        OR (id_tipousuario_destino IS NULL AND id_usuario_destino IS NOT NULL)
    )
);
GO

/* ------------------------------------------------------------
   13. LECTURAS DE NOTIFICACIONES
   Necesaria porque una notificacion broadcast (por rol) tiene
   muchos destinatarios; aqui se rastrea quien la leyo y cuando.
   Para notificaciones dirigidas a un usuario especifico tambien
   se usa esta tabla (una sola fila).
   ------------------------------------------------------------ */
CREATE TABLE notificaciones_lecturas (
    id_notificacion   int       NOT NULL,
    id_usuario        int       NOT NULL,
    leido             bit       NOT NULL DEFAULT 0,
    fecha_leido       datetime2 NULL,
    CONSTRAINT PK_notificaciones_lecturas PRIMARY KEY (id_notificacion, id_usuario),
    CONSTRAINT FK_notiflect_notificacion FOREIGN KEY (id_notificacion)
        REFERENCES notificaciones (id_notificacion),
    CONSTRAINT FK_notiflect_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
);
GO

/* ============================================================
   14. BITACORA DE ACCIONES (auditoria general de usuarios)
   Registra acciones relevantes del sistema: login, logout,
   validaciones, calificaciones, cambios de catalogo, etc.
   ============================================================ */
CREATE TABLE bitacora_acciones (
    id_bitacora    bigint IDENTITY(1,1)  NOT NULL,
    id_usuario     int                   NOT NULL,
    accion         varchar(100) COLLATE Modern_Spanish_CI_AS NOT NULL, -- ej. 'LOGIN', 'VALIDAR_ENSAYO', 'CALIFICAR'
    entidad        varchar(100) COLLATE Modern_Spanish_CI_AS NULL,     -- ej. 'participantes', 'calificaciones'
    id_entidad     int                   NULL,                        -- id del registro afectado
    detalle        nvarchar(1000)        NULL,                        -- info adicional en JSON o texto libre
    ip_origen      varchar(45)  COLLATE Modern_Spanish_CI_AS NULL,
    fecha_alta     datetime2             NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_bitacora_acciones PRIMARY KEY (id_bitacora),
    CONSTRAINT FK_bitacora_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
);
GO
CREATE INDEX IX_bitacora_usuario_fecha ON bitacora_acciones (id_usuario, fecha_alta);
GO

/* ============================================================
   DATOS INICIALES DE CATALOGO (seed)
   ============================================================ */
INSERT INTO cat_tipousuarios (descripcion) VALUES
    ('Participante'),
    ('Admin'),
    ('Juez'),
    ('Superadmin');
GO
