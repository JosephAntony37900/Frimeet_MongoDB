const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const authenticate = require('../controllers/authenticate');


router.get('/', authenticate.authenticateTokenMongoDB, placeController.getPlaces);
router.post('/', authenticate.authenticateTokenMongoDB, placeController.createPlace);
router.get('/:id', authenticate.authenticateTokenMongoDB, placeController.getPlaceById);
router.put('/:id', authenticate.authenticateTokenMongoDB, placeController.updatePlace);
router.delete('/:id', authenticate.authenticateTokenMongoDB, placeController.deletePlace);

//Autenticación con usuario en postgres
/* 
router.get('/', authenticate.authenticateToken, placeController.getPlaces);
router.post('/', authenticate.authenticateToken, placeController.createPlace);
router.get('/:id', authenticate.authenticateToken, placeController.getPlaceById);
router.put('/:id', authenticate.authenticateToken, placeController.updatePlace);
router.delete('/:id', authenticate.authenticateToken, placeController.deletePlace);
*/

module.exports = router;
