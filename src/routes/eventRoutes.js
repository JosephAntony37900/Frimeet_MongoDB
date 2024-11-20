const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const eventController = require('../controllers/eventController');
const authenticate = require('../controllers/authenticate');

//Atenticación para usuario de prueba
router.get('/', eventController.getEvents);
router.post('/', upload.array('images'),eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/delete/:id', eventController.deleteEvent);

module.exports = router;
