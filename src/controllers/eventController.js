const Event = require('../models/Event');
const Place = require('../models/Place');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Obtener todos los eventos
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('idPlace');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo evento
exports.createEvent = async (req, res) => {
  const { name, maxPeoples, idPlace, date, description, price, images } = req.body;
  let imageUrls = [];

  try {
    // Obtener la dirección del lugar relacionado
    const place = await Place.findById(idPlace);
    if (!place) {
      return res.status(400).json({ message: 'Lugar no encontrado' });
    }

    // Subir imágenes a Cloudinary
    if (images && images.length > 0) {
      for (let image of images) {
        const absolutePath = path.resolve(image);
        const result = await cloudinary.uploader.upload(absolutePath);
        imageUrls.push(result.secure_url);
      }
    }

    const newEvent = new Event({
      name,
      maxPeoples,
      idPlace,
      date,
      description,
      address: place.address,
      price,
      images: imageUrls
    });

    const result = await newEvent.save();
    res.status(201).json({
      message: "Evento creado exitosamente",
      eventId: result._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtener un evento por ID
exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'ID de evento no válido' });
  }
  try {
    const event = await Event.findById(eventId).populate('idPlace');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar un evento por ID
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'ID de evento no válido' });
  }
  try {
    const event = await Event.findByIdAndUpdate(eventId, req.body, { new: true }).populate('idPlace');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un evento por ID
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'ID de evento no válido' });
  }
  try {
    const result = await Event.findByIdAndDelete(eventId);
    if (!result) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json({ message: 'Evento eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
