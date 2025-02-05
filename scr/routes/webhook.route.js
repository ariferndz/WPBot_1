const express = require('express');
const router = express.Router();
const { verifyWebhook, handleWebhook } = require('../controllers/whatsapp.controller');

router.get('/', verifyWebhook);
router.post('/', handleWebhook);

module.exports = router;