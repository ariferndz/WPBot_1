/*
//primer version

const { Survey, Question } = require('../models/user.model');

exports.showDashboard = async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      include: [{
        model: Question,
        attributes: ['id', 'text']
      }]
    });
    res.render('admin/dashboard', { surveys });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).send('Error interno');
  }
};

exports.createSurvey = async (req, res) => {
  try {
    const { title, questions } = req.body;
    
    const survey = await Survey.create({
      title,
      status: 'active'
    });

    await Promise.all(questions.split('\n').map((text, index) => 
      Question.create({
        text: text.trim(),
        order: index + 1,
        surveyId: survey.id
      })
    ));

    res.redirect('/admin');
  } catch (error) {
    console.error('Error creando encuesta:', error);
    res.status(500).redirect('/admin');
  }
}; 
*/

const { Survey, Question } = require('../models/user.model');

/**
 * Muestra el panel de administración.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
exports.showDashboard = async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      include: [{ model: Question, as: 'questions' }],
    });
    res.render('admin/dashboard', { surveys });
  } catch (error) {
    console.error('Error mostrando el panel de administración:', error);
    res.status(500).send('Error interno del servidor');
  }
};

/**
 * Crea una nueva encuesta.
 * @param {object} req - Objeto de solicitud.
 * @param {object} res - Objeto de respuesta.
 */
exports.createSurvey = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const survey = await Survey.create({
      title,
      status: 'active',
    });

    await Promise.all(
      questions.split('\n').map((text, index) =>
        Question.create({
          text: text.trim(),
          order: index + 1,
          surveyId: survey.id,
        })
      )
    );

    res.redirect('/admin');
  } catch (error) {
    console.error('Error creando encuesta:', error);
    res.status(500).redirect('/admin');
  }
};
