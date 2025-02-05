const express = require('express');
const router = express.Router();
const { verifyWebhook, handleWebhook } = require('../controllers/whatsapp.controller');

// Ruta para verificar el webhook
router.get('/', verifyWebhook);

// Ruta para manejar las respuestas del webhook
router.post('/', handleWebhook);

module.exports = router;