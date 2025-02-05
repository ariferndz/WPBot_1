const express = require('express');
//const passport = require('passport'); // <-- Declaración única
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const { showDashboard, createSurvey } = require('../controllers/admin.controller');
const passport = require('../config/passport');

// Configuración de Passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      return done(null, { user: 'admin' });
    }
    return done(null, false);
  }
));

// Middleware de autenticación
const authenticate = passport.authenticate('local', { session: false });

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