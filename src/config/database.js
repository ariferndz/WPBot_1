const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Conexión a DB exitosa');
  } catch (error) {
    console.error('Error de conexión a DB:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };