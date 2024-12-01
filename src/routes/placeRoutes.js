const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const placeController = require('../controllers/placeController');
const { authenticateToken } = require('../controllers/authenticate');

router.get('/', placeController.getPlaces);
router.post('/suggest', placeController.suggestPlace);
router.get('/approved', authenticateToken, placeController.getApprovedPlaces);
router.post('/', authenticateToken, upload.array('images'), placeController.createPlace); 
router.get('/:id',  placeController.getPlaceById);
router.put('/update/:id', authenticateToken, upload.array('images'), placeController.updatePlace);
router.delete('/delete/:id', authenticateToken, placeController.deletePlace);
router.get('/pending/places', authenticateToken, placeController.getPendingPlaces);
router.put('/approve/:id', authenticateToken, placeController.approvePlace);
router.get('/users/places', authenticateToken, placeController.getPlacesByUser);
router.get("/random", authenticateToken, placeController.getRandomPlace);


module.exports = router;
