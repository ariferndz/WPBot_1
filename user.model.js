const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

const Survey = sequelize.define('Survey', {
  title: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive'
  }
});

const Question = sequelize.define('Question', {
  text: DataTypes.TEXT,
  order: DataTypes.INTEGER
});

const Response = sequelize.define('Response', {
  answer: DataTypes.TEXT
});

// Relaciones
Survey.hasMany(Question);
Question.belongsTo(Survey);

User.hasMany(Response);
Response.belongsTo(User);

Survey.hasMany(Response);
Response.belongsTo(Survey);

module.exports = { User, Survey, Question, Response };