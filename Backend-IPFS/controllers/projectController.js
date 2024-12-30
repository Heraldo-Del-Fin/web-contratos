// projectController.js
const { db } = require('../config/firebaseConfig'); // Asegúrate de que Firebase está configurado correctamente
const { collection, addDoc, getDoc, doc, updateDoc } = require('firebase/firestore');

// Función para crear un proyecto
const createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;
    const projectRef = collection(db, 'projects');
    await addDoc(projectRef, {
      projectName,
      description,
      members: []
    });
    res.status(201).json({ message: 'Proyecto creado con éxito' });
  } catch (error) {
    console.error('Error al crear el proyecto: ', error);
    res.status(500).json({ message: 'Error al crear el proyecto', error });
  }
};

// Función para obtener un proyecto
const getProject = async (req, res) => {
  const { projectName } = req.params;
  try {
    const projectRef = doc(db, 'projects', projectName);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      res.status(200).json(docSnap.data());
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el proyecto: ', error);
    res.status(500).json({ message: 'Error al obtener el proyecto', error });
  }
};

// Función para agregar un miembro al proyecto
const addMember = async (req, res) => {
  const { projectName } = req.params;
  const { memberEmail, role } = req.body;

  try {
    const projectRef = doc(db, 'projects', projectName);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      const projectData = docSnap.data();
      const updatedMembers = [...projectData.members, { memberEmail, role }];
      await updateDoc(projectRef, { members: updatedMembers });
      res.status(200).json({ message: 'Miembro agregado con éxito' });
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    console.error('Error al agregar miembro: ', error);
    res.status(500).json({ message: 'Error al agregar miembro', error });
  }
};

module.exports = { createProject, getProject, addMember };
