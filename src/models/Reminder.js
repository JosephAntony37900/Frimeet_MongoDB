const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema ({
    content: { type: String, required: true},
    idEvento: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true}
})

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;