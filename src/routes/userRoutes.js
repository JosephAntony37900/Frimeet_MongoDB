const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/login', userController.loginUser)
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

module.exports = router;
