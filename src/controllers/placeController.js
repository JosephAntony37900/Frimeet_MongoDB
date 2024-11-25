const Place = require('../models/Place');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const { pool } = require('../../config');
const { authenticateToken } = require('./authenticate');

// Obtener todos los lugares
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo lugar
exports.createPlace = async (req, res) => {
  const { name, description, address, tag, types, coordinates } = req.body;
  const userId = req.user.sub; // Obtener el ID del usuario del token JWT
  let imageUrls = [];

  try {
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'places' },
            (error, result) => {
              if (result) {
                imageUrls.push(result.secure_url);
                resolve();
              } else {
                console.error('Error subiendo imagen a Cloudinary:', error);
                reject(new Error('Error al subir la imagen'));
              }
            });
          stream.end(file.buffer);
        });
      }
    }

    const newPlace = new Place({
      name,
      description,
      address,
      tag,
      types,
      images: imageUrls,
      userOwner: userId, // Guardar el ID del usuario
      coordinates 
    });

    const savedPlace = await newPlace.save();
    res.status(201).json({
      message: "Lugar creado exitosamente",
      placeId: savedPlace._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un lugar por ID
exports.getPlaceById = async (req, res) => {
  const placeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: 'ID de lugar no válido' });
  }
  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener lugares creados por un usuario específico
exports.getPlacesByUser = async (req, res) => {
  const userId = req.user.sub; // Obtener el ID del usuario del token JWT
  try {
    const places = await Place.find({ userOwner: userId });
    if (places.length === 0) {
      return res.status(404).json({ message: 'No tienes lugares creados' });
    }
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar un lugar por ID
exports.updatePlace = async (req, res) => {
  const placeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: 'ID de lugar no válido' });
  }
  
  const { name, description, address, tag, types } = req.body;
  let imageUrls = req.body.images ? req.body.images : [];

  if (!name || !description || !address || !tag || !types) { 
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'places' },
            (error, result) => {
              if (result) {
                imageUrls.push(result.secure_url);
                resolve();
              } else {
                console.error('Error subiendo imagen a Cloudinary:', error);
                reject(new Error('Error al subir la imagen'));
              }
            });
          stream.end(file.buffer);
        });
      }
    }

    const updatedPlace = await Place.findByIdAndUpdate(placeId, {
      name,
      description,
      address,
      tag,
      types,
      images: imageUrls
    }, { new: true });

    if (!updatedPlace) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.json(updatedPlace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un lugar por ID
exports.deletePlace = async (req, res) => {
  const placeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: 'ID de lugar no válido' });
  }
  try {
    const result = await Place.findByIdAndDelete(placeId);
    if (!result) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.json({ message: 'Lugar eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener todos los lugares aprobados
exports.getApprovedPlaces = async (req, res) => {
  try {
    const places = await Place.find({ approve: true });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener lugares pendientes de aprobación
exports.getPendingPlaces = async (req, res) => {
  console.log('Entrando en getPendingPlaces');
  try {
    const places = await Place.find({ approve: null });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aprobar o rechazar un lugar
exports.approvePlace = async (req, res) => {
  console.log('Entrando en approvedPlace');
  const placeId = req.params.id;
  const { approve } = req.body;

  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: 'ID de lugar no válido' });
  }

  try {
    if (approve) {
      const updatedPlace = await Place.findByIdAndUpdate(placeId, { approve: true }, { new: true });
      if (!updatedPlace) {
        return res.status(404).json({ message: 'Lugar no encontrado' });
      }
      res.json(updatedPlace);
    } else {
      const deletedPlace = await Place.findByIdAndDelete(placeId);
      if (!deletedPlace) {
        return res.status(404).json({ message: 'Lugar no encontrado' });
      }
      res.json({ message: 'Lugar rechazado y eliminado' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
