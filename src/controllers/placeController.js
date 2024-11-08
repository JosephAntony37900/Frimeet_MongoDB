const Place = require('../models/Place');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const path = require('path')

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
    const { name, description, address, tag, images } = req.body;
    let imageUrls = [];
  
    try {
      // Subir imágenes a Cloudinary
      if (images && images.length > 0) {
        for (let image of images) {
          // Convierte la ruta relativa a absoluta si es necesario
          const absolutePath = path.resolve(image);
          const result = await cloudinary.uploader.upload(absolutePath);
          imageUrls.push(result.secure_url);
        }
      }
  
      const newPlace = new Place({
        name,
        description,
        address,
        tag,
        images: imageUrls
      });
  
      const result = await newPlace.save();
      res.status(201).json({
        message: "Lugar creado exitosamente",
        placeId: result._id,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
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

// Actualizar un lugar por ID
exports.updatePlace = async (req, res) => {
  const placeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: 'ID de lugar no válido' });
  }
  try {
    const place = await Place.findByIdAndUpdate(placeId, req.body, { new: true });
    if (!place) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.json(place);
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
