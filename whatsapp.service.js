const axios = require('axios');
const { User, Survey, Response } = require('../models/user.model');

exports.processMessage = async (message) => {
  const userNumber = message.from;
  const messageBody = message.text?.body || '';
  
  // Buscar o crear usuario
  let user = await User.findOne({ where: { phone: userNumber } });
  if (!user) {
    user = await User.create({ phone: userNumber });
  }

  // Lógica de encuestas
  const activeSurvey = await Survey.findOne({
    where: { status: 'active' },
    include: ['questions']
  });

  if (activeSurvey) {
    // Manejar respuestas y siguiente pregunta
    await handleSurveyResponse(user, messageBody, activeSurvey);
  } else {
    // Enviar mensaje normal
    await sendWhatsAppMessage(userNumber, 'Gracias por tu mensaje!');
  }
};

async function handleSurveyResponse(user, response, survey) {
  // Guardar respuesta
  await Response.create({
    userId: user.id,
    surveyId: survey.id,
    answer: response
  });

  // Enviar siguiente pregunta o finalizar
  const nextQuestion = await getNextQuestion(user, survey);
  
  if (nextQuestion) {
    await sendWhatsAppMessage(user.phone, nextQuestion.text);
  } else {
    await sendWhatsAppMessage(user.phone, '¡Gracias por completar la encuesta!');
  }
}

async function sendWhatsAppMessage(to, message) {
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
}