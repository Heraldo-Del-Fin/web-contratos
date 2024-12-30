// projectModel.js
const { db } = require('../config/firebaseConfig'); // Firebase Firestore
const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');

// Modelo de proyecto en Firestore
const createProject = async (projectName, ownerId) => {
  try {
    const projectRef = doc(db, 'projects', projectName);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      // Si el proyecto no existe, lo creamos
      const newProject = {
        name: projectName,
        owner: ownerId,
        members: [{ userId: ownerId, role: 'Propietario' }], // El propietario es el primer miembro
      };
      await setDoc(projectRef, newProject);
      return { success: true, message: 'Proyecto creado exitosamente', projectName };
    } else {
      return { success: false, message: 'El proyecto ya existe' };
    }
  } catch (error) {
    return { success: false, message: `Error al crear proyecto: ${error.message}` };
  }
};

const getProjectByName = async (projectName) => {
  try {
    const projectRef = doc(db, 'projects', projectName);
    const projectDoc = await getDoc(projectRef);

    if (projectDoc.exists()) {
      return { success: true, data: projectDoc.data() };
    } else {
      return { success: false, message: 'Proyecto no encontrado' };
    }
  } catch (error) {
    return { success: false, message: `Error al obtener proyecto: ${error.message}` };
  }
};

const addMemberToProject = async (projectName, userId, role) => {
  try {
    const projectRef = doc(db, 'projects', projectName);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      return { success: false, message: 'Proyecto no encontrado' };
    }

    const projectData = projectDoc.data();
    projectData.members.push({ userId, role });

    await updateDoc(projectRef, { members: projectData.members });
    return { success: true, message: 'Miembro agregado exitosamente' };
  } catch (error) {
    return { success: false, message: `Error al agregar miembro: ${error.message}` };
  }
};

module.exports = { createProject, getProjectByName, addMemberToProject };
