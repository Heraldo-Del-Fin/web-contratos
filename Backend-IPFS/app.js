const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Rutas
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.use(bodyParser.json()); // Middleware para parsear JSON

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:3000');
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
