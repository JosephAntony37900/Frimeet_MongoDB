const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const placeController = require('../controllers/placeController');
const authenticate = require('../controllers/authenticate');

router.get('/', placeController.getPlaces);
router.post('/', upload.array('images'), placeController.createPlace); 
router.get('/:id', placeController.getPlaceById);
router.put('/update/:id', upload.array('images'), placeController.updatePlace);
router.delete('/delete/:id', placeController.deletePlace);

module.exports = router;


//Autenticación con usuario en postgres
/* 
router.get('/', authenticate.authenticateToken, placeController.getPlaces);
router.post('/', authenticate.authenticateToken, placeController.createPlace);
router.get('/:id', authenticate.authenticateToken, placeController.getPlaceById);
router.put('/:id', authenticate.authenticateToken, placeController.updatePlace);
router.delete('/:id', authenticate.authenticateToken, placeController.deletePlace);
*/
