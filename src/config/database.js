const { Sequelize } = require('sequelize');

// Conexión a la base de datos
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Desactiva los logs de Sequelize en producción
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Sincroniza los modelos con la base de datos
    console.log('Conexión a DB exitosa');
  } catch (error) {
    console.error('Error de conexión a DB:', error);
    process.exit(1); // Detiene la aplicación si no puede conectarse
  }
};

module.exports = { connectDB, sequelize };