const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directorio donde se guardarán los archivos temporalmente (asegúrate de crear esta carpeta)
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    // El nombre del archivo será su nombre original
    cb(null, Date.now() + path.extname(file.originalname));  // Agregar un timestamp para evitar colisiones
  }
});

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limitar el tamaño del archivo a 10 MB (opcional)
  fileFilter: (req, file, cb) => {
    // Filtrar solo los tipos de archivo permitidos
    const filetypes = /jpeg|jpg|png|gif|pdf|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: El archivo debe ser una imagen o un archivo de texto/PDF');
    }
  }
});

module.exports = upload;
