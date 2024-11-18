const Reminder = require('../models/Reminder');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// Crear un nuevo recordatorio
exports.createReminder = async (req, res) => {
  const { content, idEvent, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(idEvent)) {
    return res.status(400).json({ message: 'ID de evento no válido.' });
  }

  try {
    const event = await Event.findById(idEvent);
    if (!event) {
      return res.status(400).json({ message: 'Evento no encontrado.' });
    }

    const newReminder = new Reminder({
      content,
      idEvent,
      date,
      attendees: event.attendees, // Agregar lista de asistentes del evento
    });

    const result = await newReminder.save();
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
  
  // Aquí puedes implementar la lógica para enviar notificaciones
  // a los asistentes. Por ejemplo, puedes usar una API de correo electrónico
  // o SMS para enviar los recordatorios.
  console.log(`Enviando recordatorio: ${content} a los asistentes: ${attendees.join(', ')}`);
};

// Programar el envío de recordatorios
const scheduleReminders = async () => {
  const reminders = await Reminder.find({});
  reminders.forEach(reminder => {
    const now = new Date();
    const timeToReminder = reminder.date - now;

    if (timeToReminder > 0) {
      setTimeout(() => sendReminder(reminder), timeToReminder);
    }
  });
};

scheduleReminders();
