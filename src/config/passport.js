const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configuración de la estrategia local
passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      return done(null, { user: 'admin' });
    }
    return done(null, false, { message: 'Credenciales incorrectas' });
  }
));

// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialización del usuario
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;