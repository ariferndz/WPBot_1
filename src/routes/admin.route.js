const express = require('express');
const router = express.Router();
const { showDashboard, createSurvey } = require('../controllers/admin.controller');

// Ruta para mostrar el panel de administración
router.get('/', showDashboard);

// Ruta para crear una nueva encuesta
router.post('/surveys', createSurvey);

module.exports = router;