const express = require('express');
const router = express.Router();
const { showDashboard, createSurvey } = require('../controllers/admin.controller');

// Ruta para mostrar el panel de administración
router.get('/', showDashboard);

// Ruta para crear una nueva encuesta
router.post('/surveys', createSurvey);

module.exports = router;

// En admin.route.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      return done(null, { user: 'admin' });
    }
    return done(null, false);
  }
));


// Protege las rutas
router.get('/', 
  passport.authenticate('local', { session: false }), 
  showDashboard
);