require('dotenv').config(); // <-- Agrega esta línea al inicio del archivo
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { connectDB } = require('./config/database');
const webhookRoutes = require('./routes/webhook.route');
const adminRoutes = require('./routes/admin.route');

const app = express();

// Configuración básica
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/webhook', webhookRoutes);
app.use('/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Chatbot WhatsApp Funcionando!');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});