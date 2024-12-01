const Reminder = require('../models/Reminder');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const axios = require('axios');  // Usar axios para hacer solicitudes HTTP

// Crear un nuevo recordatorio
exports.createReminder = async (req, res) => {
  const { content, idEvent, titule } = req.body;
  const token = req.headers.authorization; // Obtener el token JWT de los encabezados

  if (!mongoose.Types.ObjectId.isValid(idEvent)) {
    return res.status(400).json({ message: 'ID de evento no válido.' });
  }

  try {
    const event = await Event.findById(idEvent);
    if (!event) {
      return res.status(400).json({ message: 'Evento no encontrado.' });
    }

    const newReminder = new Reminder({
      nameEvent: event.name,
      content,
      idEvent,
      titule,
      attendees: event.attendees, // Agregar lista de asistentes del evento
    });

    const result = await newReminder.save();

    // Actualizar recordatorios en PostgreSQL para cada asistente
    const attendees = event.attendees;  // Lista de IDs de usuarios en PostgreSQL
    for (const userId of attendees) {
      await axios.patch(`http://127.0.0.1:5000/users/${userId}/addReminder`, {
        eventReminder: event.name,
        ContentReminder: content,
        nameReminder: titule
      }, {
        headers: {
          Authorization: token  // Incluir el token JWT en los encabezados
        }
      });
    }

    res.status(201).json({
      message: "Recordatorio creado con éxito",
      reminderId: result._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un recordatorio por ID
exports.deleteReminder = async (req, res) => {
  const reminderId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ message: 'ID de recordatorio no válido.' });
  }
  try {
    const reminder = await Reminder.findByIdAndDelete(reminderId);
    if (!reminder) {
      return res.status(404).json({ message: 'Recordatorio no encontrado.' });
    }
    res.json({ message: 'Recordatorio eliminado.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Enviar recordatorio a los asistentes
const sendReminder = async (reminder) => {
  const { content, attendees } = reminder;
  
  console.log(`Enviando recordatorio: ${content} a los asistentes: ${attendees.join(', ')}`);
};
