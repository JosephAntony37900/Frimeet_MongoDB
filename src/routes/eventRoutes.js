const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../controllers/authenticate');

router.get('/', eventController.getEvents);
router.post('/', authenticateToken, upload.array('images'), eventController.createEvent);
router.get('/:id',  eventController.getEventById);
router.put('/:id', authenticateToken, upload.array('images'), eventController.updateEvent);
router.delete('/delete/:id', authenticateToken, eventController.deleteEvent);
router.get('/user/events', authenticateToken, eventController.getEventsByUser);
router.get('/user/attending', authenticateToken, eventController.getAttendingEvents);
router.post('/:id/join', authenticateToken, eventController.joinEvent); // Unirse a un evento
router.post('/:id/leave', authenticateToken, eventController.leaveEvent); // Salirse de un evento

module.exports = router;