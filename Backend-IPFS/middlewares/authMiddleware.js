const { auth } = require('../config/firebaseConfig');
const { getAuth } = require('firebase/auth');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const user = await auth.verifyIdToken(token); // Verifica el token de usuario
    req.user = user;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido o expirado', error });
  }
};

module.exports = authMiddleware;
