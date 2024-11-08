const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxPeoples: { type: Number, required: true },
  idPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: false },
  willAttend: { type: Number, default: 0 },
  images: [String] // Array de URLs de imágenes
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
