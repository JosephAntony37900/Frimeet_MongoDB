const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxPeoples: { type: Number, required: true },
  idPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: false },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: false },
  willAttend: { type: Number, default: 0 },
  totalStarts: { type: Number, default: 0 },
  totalOpinions: { type: Number, default: 0 },
  attendees: [{ type: Number }],
  images: [String], // Array de URLs de imágenes
  userOwner: { type: Number, required: true },
  prioridad: { type: Number, required: true },
  coordinates: {
    lat: {type: Number, required:true},
    lng: {type: Number, requirer: true},
  },
  date: { type: Date, required: true},
  tag: [{ type: String}]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
