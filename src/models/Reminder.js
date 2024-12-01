const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema ({
    nameEvent: {type: String, required: true},
    titule: { type: String, required: true},
    content: { type: String, required: true},
    idEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true}, // de aquí se extraira el nombre de los eventos
    attendees: [{ type: Number }], // Lista de IDs de los asistentes
})

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;