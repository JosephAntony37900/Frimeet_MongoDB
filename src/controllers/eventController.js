const Event = require('../models/Event');
const Place = require('../models/Place');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const { pool } = require('../../config');
const { authenticateToken } = require('./authenticate');

// Obtener todos los eventos
exports.getEvents = async (req, res) => {
  try {
    // Ordenar primero por prioridad descendente y luego por fecha ascendente
    const events = await Event.find().populate('idPlace').sort({ prioridad: -1, date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo evento
exports.createEvent = async (req, res) => {
  const { name, maxPeoples, idPlace, endDate, description, price, address, coordinates, date } = req.body;
  let tag = req.body['tag[]'] || req.body.tag;  // Manejar etiquetas como un arreglo
  const userId = req.user.sub;
  const userRole = req.user.id_Rol;
  let imageUrls = [];

  try {
    console.log('Datos recibidos:', req.body);
    console.log('User ID:', userId);
    console.log('User Role:', userRole);

    // Validar idPlace solo si no es "0"
    if (idPlace && idPlace !== "0") {
      const place = await Place.findById(idPlace);
      if (!place) {
        return res.status(400).json({ message: 'Lugar no encontrado' });
      }
    }

    // Subir imágenes a Cloudinary
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'events' },
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
    console.log('URL de imágenes:', imageUrls);

    // Asegurar que las etiquetas sean un arreglo
    if (typeof req.body.tag === 'string') {
        tag = [req.body.tag];
      } else if (!Array.isArray(req.body.tag)) {
        tag = [];
      }

    // Convertir etiquetas a un arreglo si no lo son
    if (!Array.isArray(tag)) {
      tag = [tag];
    }

    console.log('Datos finales para crear evento:', {
      name, maxPeoples, idPlace, endDate, description, price, address, coordinates, date, tag, imageUrls, userId, userRole
    });

    // Crear nuevo evento
    const newEvent = new Event({
      name,
      maxPeoples,
      idPlace: idPlace !== "0" ? idPlace : undefined, // No enviar idPlace si es "0"
      endDate,
      description,
      address,
      price,
      images: imageUrls,
      userOwner: userId,
      prioridad: userRole,
      coordinates,
      date,
      tag  // Asegurarse de que `tag` sea una lista
    });

    console.log('Evento creado:', newEvent);

    const result = await newEvent.save();
    console.log('Evento guardado:', result);
    res.status(201).json({
      message: "Evento creado exitosamente",
      eventId: result._id,
    });
  } catch (err) {
    console.error('Error al crear evento:', err.message);
    res.status(500).json({ message: err.message });
  }
};



// Unirse a un evento
exports.joinEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.sub; // Obtener el ID del usuario desde el token

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'ID de evento no válido' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar si el usuario ya está en la lista de asistentes
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
    }

    // Verificar si el evento ha alcanzado el máximo de personas
    if (event.attendees.length >= event.maxPeoples) {
      return res.status(400).json({ message: 'El evento ha alcanzado el máximo de asistentes' });
    }

    // Agregar el usuario a la lista de asistentes
    event.attendees.push(userId);
    event.willAttend = event.attendees.length;
    await event.save();

    res.status(200).json({ message: 'Te has unido al evento exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Salirse de un evento
exports.leaveEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = parseInt(req.user.sub, 10); // Obtener el ID del usuario desde el token y convertirlo a número

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'ID de evento no válido' });
  }
  console.log('Id del usuario que desea salirse: ', userId);
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar si el usuario está en la lista de asistentes
    if (!event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'No estás inscrito en este evento' });
    }

    // Eliminar el usuario de la lista de asistentes
    event.attendees = event.attendees.filter(attendee => attendee !== userId);
    event.willAttend = event.attendees.length;
    await event.save();

    res.status(200).json({ message: 'Te has salido del evento exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Obtener eventos creados por un usuario específico
exports.getEventsByUser = async (req, res) => {
  const userId = req.user.sub; // Obtener el ID del usuario desde el token
  try {
    const events = await Event.find({ userOwner: userId });
    if (events.length === 0) {
      return res.status(404).json({ message: 'No tienes eventos creados' });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Actualizar un evento por ID
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'ID de evento no válido' });
  }

  // Obtener los datos del evento actual
  const currentEvent = await Event.findById(eventId);
  if (!currentEvent) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }

  const { name, description, address, maxPeoples, date, endDate, price } = req.body;
  let { tag, coordinates, existingImages } = req.body;
  let imageUrls = req.body.images ? req.body.images : [];

  // Usar los valores actuales si no se proporcionan nuevos
  tag = tag || currentEvent.tag;
  coordinates = coordinates ? JSON.parse(coordinates) : currentEvent.coordinates;

  // Añadir imágenes existentes
  if (existingImages) {
    imageUrls = imageUrls.concat(existingImages);
  }

  console.log('Campos recibidos:', { name, description, address, tag, maxPeoples, date, endDate, price, coordinates });

  if (!name || !description || !address || !maxPeoples || !date || !endDate || !price) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios', fields: { name, description, address, tag, maxPeoples, date, endDate, price, coordinates } });
  }

  try {
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'events' },
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

    const updatedEvent = await Event.findByIdAndUpdate(eventId, {
      name,
      description,
      address,
      tag: Array.isArray(tag) ? tag : [tag], // Asegurarse de que `tag` sea un arreglo
      maxPeoples,
      date,
      endDate,
      price,
      coordinates,
      images: imageUrls
    }, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(updatedEvent);
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

// Obtener eventos a los que asistirá el usuario actual
exports.getAttendingEvents = async (req, res) => {
  const userId = req.user.sub; // Obtener el ID del usuario desde el token
  try {
    const events = await Event.find({ attendees: userId });
    if (events.length === 0) {
      return res.status(404).json({ message: 'No estás inscrito en ningún evento' });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

