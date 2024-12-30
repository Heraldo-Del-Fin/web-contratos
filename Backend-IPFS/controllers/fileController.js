const fs = require('fs');
require('dotenv').config();
const { db } = require('../config/firebaseConfig');
const { collection, addDoc, getDoc, doc, updateDoc } = require('firebase/firestore');
// Fix the Pinata SDK import and initialization
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

// Function to upload a file to IPFS
const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No se ha recibido el archivo' });
    }

    const readableStreamForFile = fs.createReadStream(file.path);
    const options = {
      pinataMetadata: {
        name: file.originalname,
        keyvalues: {
          uploadDate: new Date().toISOString()
        }
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    // Upload file to Pinata
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    // Store file metadata in Firebase
    const fileRef = await addDoc(collection(db, 'files'), {
      fileName: file.originalname,
      ipfsHash: result.IpfsHash,
      uploadDate: new Date().toISOString(),
      size: file.size,
      mimeType: file.mimetype
    });

    // Clean up the temporary file
    fs.unlinkSync(file.path);

    res.status(200).json({ 
      message: 'Archivo subido con éxito',
      ipfsHash: result.IpfsHash,
      fileId: fileRef.id
    });

  } catch (error) {
    console.error('Error al subir el archivo: ', error);
    // Clean up the temporary file in case of error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: 'Error al subir el archivo', 
      error: error.message 
    });
  }
};

// Function to edit file metadata (since IPFS files are immutable)
const editFile = async (req, res) => {
  const { fileId, newMetadata } = req.body;

  try {
    if (!fileId) {
      return res.status(400).json({ message: 'ID del archivo es requerido' });
    }

    // Get the file document from Firebase
    const fileRef = doc(db, 'files', fileId);
    const fileDoc = await getDoc(fileRef);

    if (!fileDoc.exists()) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    // Update metadata in Firebase
    await updateDoc(fileRef, {
      ...newMetadata,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ 
      message: 'Metadatos del archivo actualizados con éxito',
      fileId: fileId
    });

  } catch (error) {
    console.error('Error al editar los metadatos del archivo: ', error);
    res.status(500).json({ 
      message: 'Error al editar los metadatos del archivo', 
      error: error.message 
    });
  }
};

// Function to get file metadata
const getFileMetadata = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const fileRef = doc(db, 'files', fileId);
    const fileDoc = await getDoc(fileRef);

    if (!fileDoc.exists()) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    res.status(200).json({ 
      message: 'Metadatos recuperados con éxito',
      metadata: fileDoc.data()
    });

  } catch (error) {
    console.error('Error al obtener los metadatos del archivo: ', error);
    res.status(500).json({ 
      message: 'Error al obtener los metadatos del archivo', 
      error: error.message 
    });
  }
};

module.exports = { 
  uploadFile, 
  editFile,
  getFileMetadata
};