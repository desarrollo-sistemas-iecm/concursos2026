const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Asegurar que el directorio de destino existe
const uploadDir = path.join(__dirname, '../../uploads/ensayos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único aleatorio para seguridad (evitar adivinar archivos de otros)
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtro de validación para aceptar únicamente archivos PDF
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Únicamente se permiten archivos en formato PDF (.pdf).'));
};

// Filtro flexible para documentos dinámicos (PDF, JPG, JPEG, PNG)
const flexibleFileFilter = (req, file, cb) => {
  const filetypes = /pdf|jpg|jpeg|png/;
  const mimetype = filetypes.test(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Únicamente se permiten archivos PDF o Imágenes (.pdf, .jpg, .jpeg, .png).'));
};

// Limitar el tamaño a 10MB para ensayos
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

// Limitar a 15MB para documentos dinámicos
const uploadDocumento = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: flexibleFileFilter
});

module.exports = {
  upload,
  uploadDocumento
};

