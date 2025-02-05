const { Survey, Response } = require('../models/user.model');

exports.showDashboard = async (req, res) => {
  const surveys = await Survey.findAll({
    include: [{
      model: Response,
      attributes: ['id']
    }]
  });
  res.render('admin/dashboard', { surveys });
};

exports.createSurvey = async (req, res) => {
  const { title, questions } = req.body;
  
  const survey = await Survey.create({
    title,
    status: 'active'
  });

  await Promise.all(questions.map((q, index) => 
    Question.create({
      text: q,
      order: index + 1,
      surveyId: survey.id
    })
  ));

  res.redirect('/admin');
};