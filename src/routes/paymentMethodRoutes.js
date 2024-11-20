const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const paymentMethodController = require('../controllers/paymentMethodController')

router.post('/', paymentMethodController.createPayment);

module.exports = router;