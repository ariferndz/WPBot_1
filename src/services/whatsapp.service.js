const axios = require('axios');
const { User, Survey, Question, Response } = require('../models/user.model');

const sendWhatsAppMessage = async (to, message) => {
  try {
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: message }
    };

    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error enviando mensaje:', error.response?.data || error.message);
  }
};

const getNextQuestion = async (userId, surveyId) => {
  const lastResponse = await Response.findOne({
    where: { userId, surveyId },
    order: [['createdAt', 'DESC']]
  });

  const questions = await Question.findAll({
    where: { surveyId },
    order: [['order', 'ASC']]
  });

  if (!lastResponse) return questions[0];
  const lastQuestionIndex = questions.findIndex(q => q.id === lastResponse.questionId);
  return questions[lastQuestionIndex + 1];
};

exports.processMessage = async (message) => {
  const userNumber = message.from;
  const messageBody = message.text?.body || '';
  
  let user = await User.findOne({ where: { phone: userNumber } });
  if (!user) {
    user = await User.create({ phone: userNumber });
  }

  const activeSurvey = await Survey.findOne({
    where: { status: 'active' },
    include: [{ model: Question, as: 'questions' }]
  });

  if (activeSurvey) {
    const currentQuestion = await getNextQuestion(user.id, activeSurvey.id);
    
    if (currentQuestion) {
      await Response.create({
        userId: user.id,
        surveyId: activeSurvey.id,
        questionId: currentQuestion.id,
        answer: messageBody
      });

      const nextQuestion = await getNextQuestion(user.id, activeSurvey.id);
      if (nextQuestion) {
        await sendWhatsAppMessage(userNumber, nextQuestion.text);
      } else {
        await sendWhatsAppMessage(userNumber, '¡Encuesta completada! Gracias');
      }
    }
  } else {
    await sendWhatsAppMessage(userNumber, 'Mensaje recibido. No hay encuestas activas actualmente.');
  }
};