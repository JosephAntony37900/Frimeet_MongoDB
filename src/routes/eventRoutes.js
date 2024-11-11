const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticate = require('../controllers/authenticate');

//Atenticación para usuario de prueba
router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/delete/:id', eventController.deleteEvent);

//Autenticación con usuario en postgres
/* 
router.get('/', authenticate.authenticateToken, eventController.getEvents);
router.post('/', authenticate.authenticateToken, eventController.createEvent);
router.get('/:id', authenticate.authenticateToken, eventController.getEventById);
router.put('/:id', authenticate.authenticateToken, eventController.updateEvent);
router.delete('/:id', authenticate.authenticateToken, eventController.deleteEvent);
*/

module.exports = router;
