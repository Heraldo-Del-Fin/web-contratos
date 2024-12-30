// authController.js
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { auth } = require('../config/firebaseConfig'); // Firebase Authentication
const { db } = require('../config/firebaseConfig'); // Firebase Firestore
const { doc, setDoc } = require('firebase/firestore');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registro de usuario
exports.registerUser = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName,
      roles: ['Editor']
    });

    return res.status(201).json({ message: 'Usuario registrado correctamente', userId: user.uid });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Iniciar sesión de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generar el token
    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // Envía el token al cliente
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Credenciales inválidas', error: error.message });
  }
};
