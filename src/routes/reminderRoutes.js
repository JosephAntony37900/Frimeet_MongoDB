const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authenticate = require('../controllers/authenticate');


router.post('/', authenticate.authenticateTokenMongoDB, reminderController.createReminder);
router.delete('/:id', authenticate.authenticateTokenMongoDB, reminderController.deleteReminder);

//Autenticación con usuario en postgres
/*
router.post('/', authenticate.authenticateToken, reminderController.createReminder);
router.delete('/:id', authenticate.authenticateToken, reminderController.deleteReminder);
*/

module.exports = router;
