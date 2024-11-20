const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: { type: String, required: true },
  starts: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 1 && v <= 5;
      },
      message: props => `${props.value} no es una calificación válida. Debe estar entre 1 y 5.`
    }
  },
  idPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: false },
  idEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
  userId: { type: Number, required: true },
  nameUser: { type: String, required: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
