const express = require('express');
const router = express.Router();
const tokensMPController = require('../controllers/tokensMPController');

router.get('/all', tokensMPController.getTokens)
router.post('/', tokensMPController.createToken);
router.delete('/:id', tokensMPController.deleteToken);

module.exports = router;
