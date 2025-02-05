const axios = require('axios');
const { User, Survey, Question, Response } = require('../models/user.model');

const sendWhatsAppMessage = async (to, messageContent) => {
  try {
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: messageContent }
    };

    // Si es mensaje interactivo (botones)
    if (typeof messageContent === 'object') {
      data.type = "interactive";
      data.interactive = messageContent;
    }

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error enviando mensaje:', error.response?.data || error.message);
    throw new Error('Error al enviar mensaje por WhatsApp');
  }
};

const getNextQuestion = async (userId, surveyId) => {
  try {
    const lastResponse = await Response.findOne({
      where: { userId, surveyId },
      order: [['createdAt', 'DESC']]
    });

    const questions = await Question.findAll({
      where: { surveyId },
      order: [['order', 'ASC']]
    });

    if (!questions || questions.length === 0) return null;
    if (!lastResponse) return questions[0];

    const lastQuestionIndex = questions.findIndex(q => q.id === lastResponse.questionId);
    return questions[lastQuestionIndex + 1] || null;

  } catch (error) {
    console.error('Error obteniendo siguiente pregunta:', error);
    throw error;
  }
};

exports.processMessage = async (message) => {
  try {
    const userNumber = message.from;
    const messageBody = message.text?.body || message.interactive?.button_reply?.id || '';

    // Buscar o crear usuario
    let user = await User.findOne({ where: { phone: userNumber } });
    if (!user) {
      user = await User.create({ phone: userNumber });
    }
    const { getUserState, setUserState, getUserData, setUserData } = require('./state.service');

exports.processMessage = async (message) => {
  const userNumber = message.from;
  const messageBody = message.text?.body || message.interactive?.button_reply?.id || '';

  // Obtener estado actual del usuario
  const estadoActual = getUserState(userNumber);

  // Lógica basada en el estado
  switch (estadoActual) {
    case 'INICIO':
      await sendWhatsAppMessage(userNumber, 'Bienvenido. Por favor, elige una opción:');
      setUserState(userNumber, 'ESPERANDO_OPCION');
      break;

    case 'ESPERANDO_OPCION':
      if (messageBody === 'opcion1') {
        await sendWhatsAppMessage(userNumber, 'Elegiste la opción 1.');
        setUserState(userNumber, 'FINALIZADO');
      } else if (messageBody === 'opcion2') {
        await sendWhatsAppMessage(userNumber, 'Elegiste la opción 2.');
        setUserState(userNumber, 'FINALIZADO');
      } else {
        await sendWhatsAppMessage(userNumber, 'Opción no válida. Intenta de nuevo.');
      }
      break;

    case 'FINALIZADO':
      await sendWhatsAppMessage(userNumber, 'Gracias por usar nuestro servicio.');
      resetUser(userNumber); // Reiniciar estado
      break;

    default:
      await sendWhatsAppMessage(userNumber, 'Estado no reconocido. Reiniciando...');
      resetUser(userNumber);
  }
};
  } catch (error) {
    console.error('Error procesando mensaje:', error);
    throw error;
  }
};