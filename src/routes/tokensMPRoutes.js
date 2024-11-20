const express = require('express');
const router = express.Router();
const tokensMPController = require('../controllers/tokensMPController');

router.get('/all', tokensMPController.getTokens)
router.post('/', tokensMPController.createToken);
router.delete('/:id', tokensMPController.deleteToken);

//Autenticación con usuario en postgres
/*
router.post('/', authenticate.authenticateToken, tokensMPController.createtokensMP);
router.delete('/:id', authenticate.authenticateToken, tokensMPController.deletetokensMP);
*/

module.exports = router;
