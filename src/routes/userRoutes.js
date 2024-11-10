const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../controllers/authenticate');


router.get('/', authenticate.authenticateTokenMongoDB, userController.getUsers);
router.post('/login', userController.loginUser)
router.post('/', userController.createUser);
router.get('/:id', authenticate.authenticateTokenMongoDB, userController.getUserById);
router.delete('/:id', authenticate.authenticateTokenMongoDB, userController.deleteUser);

//Autenticación con usuario en postgres
/* 
router.get('/', authenticate.authenticateToken, userController.getUsers);
router.post('/login', userController.loginUser)
router.post('/', userController.createUser);
router.get('/:id', authenticate.authenticateToken, userController.getUserById);
router.delete('/:id', authenticate.authenticateToken, userController.deleteUser);
*/

module.exports = router;
