const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const authenticate = require('../controllers/authenticate');


router.get('/', placeController.getPlaces);
router.post('/', placeController.createPlace);
router.get('/:id', placeController.getPlaceById);
router.put('/:id', placeController.updatePlace);
router.delete('/delete/:id', placeController.deletePlace);

//Autenticación con usuario en postgres
/* 
router.get('/', authenticate.authenticateToken, placeController.getPlaces);
router.post('/', authenticate.authenticateToken, placeController.createPlace);
router.get('/:id', authenticate.authenticateToken, placeController.getPlaceById);
router.put('/:id', authenticate.authenticateToken, placeController.updatePlace);
router.delete('/:id', authenticate.authenticateToken, placeController.deletePlace);
*/

module.exports = router;
