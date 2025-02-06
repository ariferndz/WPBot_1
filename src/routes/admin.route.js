const express = require('express');
const passport = require('passport'); // <-- Declaración única
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const passport = require('../config/passport');
const { showDashboard, createSurvey } = require('../controllers/admin.controller');
const passport = require('../config/passport');

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Ruta para procesar el inicio de sesión
router.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: false // Puedes habilitar mensajes flash si lo necesitas
  })
);

// Middleware de autenticación
const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
};

// Ruta para mostrar el panel de administración (protegida)
router.get('/', authenticate, showDashboard);

// Ruta para crear una nueva encuesta (protegida)
router.post('/surveys', authenticate, createSurvey);

module.exports = router;

// Protege las rutas
router.get('/', 
  passport.authenticate('local', { session: false }), 
  showDashboard
);