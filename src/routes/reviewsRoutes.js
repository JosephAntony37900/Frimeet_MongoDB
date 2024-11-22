const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewsController');
const authenticate = require('../controllers/authenticate');

router.post('/', authenticate.authenticateToken, reviewController.createReview);
router.get('/place/:id', authenticate.authenticateToken, reviewController.getReviewsByIdPlace);
router.get('/event/:id', authenticate.authenticateToken, reviewController.getReviewsByIdEvent);
router.delete('/:id', authenticate.authenticateToken, reviewController.deleteReview);

module.exports = router;