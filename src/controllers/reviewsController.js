const Review = require('../models/Review');
const Event = require('../models/Event');
const Place = require('../models/Place');
const mongoose = require('mongoose');
const { authenticateToken } = require('./authenticate');

// Crear una nueva reseña
exports.createReview = async (req, res) => {
  const { content, starts, idPlace, idEvent } = req.body;
  const userId = req.user.sub;
  const userName = req.user.nombre;

  if ((!idPlace && !idEvent) || (idPlace && idEvent)) {
    return res.status(400).json({ message: 'Debe proporcionar un idPlace o un idEvent, pero no ambos.' });
  }

  // Validar que las estrellas estén entre 1 y 5
  if (starts && (starts < 1 || starts > 5)) {
    return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5 estrellas.' });
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
      idEvent,
      userId,
      nameUser: userName
    });

    const result = await newReview.save();

    // Actualizar el promedio de estrellas y total de opiniones
    if (idPlace) {
      await updatePlaceStats(idPlace, starts);
    } else if (idEvent) {
      await updateEventStats(idEvent, starts);
    }

    res.status(201).json({
      message: "Comentario creado con éxito",
      reviewId: result._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Función para actualizar las estadísticas de un lugar
async function updatePlaceStats(idPlace, newRating) {
  try {
    const reviews = await Review.find({ idPlace, starts: { $exists: true } });
    const totalReviews = reviews.length;
    const totalStars = reviews.reduce((acc, review) => acc + review.starts, 0);
    const averageStars = totalStars / totalReviews;
    await Place.findByIdAndUpdate(
      idPlace,
      { totalStarts: averageStars, $inc: { totalOpinions: 1 } },
      { new: true, runValidators: false }
    );
  } catch (err) {
    console.error('Error actualizando las estadísticas del lugar:', err.message);
  }
}

// Función para actualizar las estadísticas de un evento
async function updateEventStats(idEvent, newRating) {
  try {
    const reviews = await Review.find({ idEvent, starts: { $exists: true } });
    const totalReviews = reviews.length;
    const totalStars = reviews.reduce((acc, review) => acc + review.starts, 0);
    const averageStars = totalStars / totalReviews;
    await Event.findByIdAndUpdate(
      idEvent,
      { totalStarts: averageStars, $inc: { totalOpinions: 1 } },
      { new: true, runValidators: false }
    );
  } catch (err) {
    console.error('Error actualizando las estadísticas del evento:', err.message);
  }
}

// Obtener reseñas por ID de lugar
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

// Obtener reseñas por ID de evento
exports.getReviewsByIdEvent = async (req, res) => {
  const idEvent = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(idEvent)) {
    return res.status(400).json({ message: 'ID de evento no válido.' });
  }
  try {
    const reviews = await Review.find({ idEvent: idEvent });
    res.json(reviews);
  } catch (err) {
    res.status500().json({ message: err.message });
  }
};

// Eliminar una reseña por ID
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

// Obtener todas las reseñas de un usuario
exports.getReviewsByUser = async (req, res) => {
  const userId = req.user.sub;
  
  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario no válido.' });
  }
  
  try {
    const reviews = await Review.find({ userId: userId });
    
    // Obtener los nombres de los lugares correspondientes a las reseñas
    const reviewsWithPlaceNames = await Promise.all(reviews.map(async (review) => {
      let placeName = '';
      if (review.idPlace) {
        const place = await Place.findById(review.idPlace);
        if (place) {
          placeName = place.name;
        }
      }
      return { ...review._doc, placeName };
    }));
    
    res.json(reviewsWithPlaceNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

