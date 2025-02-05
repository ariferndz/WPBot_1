const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');
const webhookRoutes = require('./routes/webhook.route');
const adminRoutes = require('./routes/admin.route');

const app = express();

// Configuración básica
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/webhook', webhookRoutes);
app.use('/admin', adminRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});