const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, { timestamps: true });

const Survey = sequelize.define('Survey', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive'
  }
}, { timestamps: true });

const Question = sequelize.define('Question', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { timestamps: true });

const Response = sequelize.define('Response', {
  answer: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { timestamps: true });

// Relaciones
Survey.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Survey);

User.hasMany(Response, { onDelete: 'CASCADE' });
Response.belongsTo(User);

Survey.hasMany(Response, { onDelete: 'CASCADE' });
Response.belongsTo(Survey);

module.exports = { User, Survey, Question, Response };