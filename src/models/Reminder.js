const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema ({
    content: { type: String, required: true},
    idEvento: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    date: { type: Date, required: true }, // Fecha y hora para enviar el recordatorio
    attendees: [{ type: Number }], // Lista de IDs de los asistentes
})

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;