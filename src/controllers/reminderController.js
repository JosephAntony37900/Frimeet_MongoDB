const Reminder = require('../models/Reminder');
const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.createReminder = async (req, res) => {
  const { content, idEvent } = req.body;

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
      idEvent
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
