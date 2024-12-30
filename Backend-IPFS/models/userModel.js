// userModel.js
const { db } = require('../config/firebaseConfig'); // Firebase Firestore
const { doc, getDoc, setDoc } = require('firebase/firestore');

// Modelo de usuario en Firestore
const createUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Si el usuario no existe, lo creamos
      await setDoc(userRef, userData);
      return { success: true, message: 'Usuario creado exitosamente' };
    } else {
      return { success: false, message: 'El usuario ya existe' };
    }
  } catch (error) {
    return { success: false, message: `Error al crear usuario: ${error.message}` };
  }
};

const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, message: 'Usuario no encontrado' };
    }
  } catch (error) {
    return { success: false, message: `Error al obtener usuario: ${error.message}` };
  }
};

module.exports = { createUser, getUserById };
