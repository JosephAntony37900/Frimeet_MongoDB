const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewsController');
const authenticate = require('../controllers/authenticate');

router.post('/', authenticate.authenticateTokenMongoDB, reviewController.createReview);
router.get('/place/:id', authenticate.authenticateTokenMongoDB, reviewController.getReviewsByIdPlace);
router.get('/event/:id', authenticate.authenticateTokenMongoDB, reviewController.getReviewsByIdEvent);
router.delete('/:id', authenticate.authenticateTokenMongoDB, reviewController.deleteReview);

//Autenticación con usuario en postgres
/*router.post('/', authenticate.authenticateToken, reviewController.createReview);
router.get('/place/:id', authenticate.authenticateToken, reviewController.getReviewsByIdPlace);
router.get('/event/:id', authenticate.authenticateToken,reviewController.getReviewsByIdEvent);
router.delete('/:id', authenticate.authenticateToken,reviewController.deleteReview); */

module.exports = router;
