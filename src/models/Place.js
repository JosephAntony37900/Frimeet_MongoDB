const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  types: { type: String, required: true},
  address: { type: String, required: true },
  tag: { type: String, required: true },
  totalStarts: { type: Number, default: 0 },
  totalOpinions: { type: Number, default: 0 },
  images: [String], // Array de URLs de imágenes
  approve: { type: Boolean, default: null },
  userOwner: { type: Number, required: false },
  coordinates: {
    lat: {type: Number, required:true},
    lng: {type: Number, requirer: true},
  },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
