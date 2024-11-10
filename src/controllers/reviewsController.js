const Review = require('../models/Review');
const Event = require('../models/Event');
const Place = require('../models/Place');
const mongoose = require('mongoose');
  

exports.createReview = async (req, res) => {
  const { content, starts, idPlace, idEvent } = req.body;

  if ((!idPlace && !idEvent) || (idPlace && idEvent)) {
    return res.status(400).json({ message: 'Debe proporcionar un idPlace o un idEvent, pero no ambos.' });
  }

  try {
    if (idPlace) {
      const place = await Place.findById(idPlace);
      if (!place) {
        return res.status(400).json({ message: 'Lugar no encontrado.' });
      }
    } else if (idEvent) {
      const event = await Event.findById(idEvent);
      if (!event) {
        return res.status(400).json({ message: 'Evento no encontrado.' });
      }
    }

    const newReview = new Review({
      content,
      starts,
      idPlace,
      idEvent
    });

    const result = await newReview.save();
    res.status(201).json({
      message: "Comentario creado con éxito",
      reviewId: result._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsByIdPlace = async (req, res) => {
  const idPlace = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(idPlace)) {
    return res.status(400).json({ message: 'ID de lugar no válido.' });
  }
  try {
    const reviews = await Review.find({ idPlace: idPlace });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsByIdEvent = async (req, res) => {
  const idEvent = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(idEvent)) {
    return res.status(400).json({ message: 'ID de evento no válido.' });
  }
  try {
    const reviews = await Review.find({ idEvent: idEvent });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ message: 'ID de review no válido.' });
  }
  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review no encontrado.' });
    }
    res.json({ message: 'Review eliminado.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
