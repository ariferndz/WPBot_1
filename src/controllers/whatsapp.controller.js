const { processMessage } = require('../services/whatsapp.service');

exports.verifyWebhook = (req, res) => {
  try {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verificado');
      res.status(200).send(challenge);
    } else {
      console.error('Token de verificación inválido');
      res.sendStatus(403);
    }
  } catch (error) {
    console.error('Error en verifyWebhook:', error);
    res.sendStatus(500);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) {
      return res.sendStatus(200);
    }

    const changes = entry.changes?.[0];
    const message = changes?.value?.messages?.[0];
    
    if (message) {
      await processMessage(message);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error en handleWebhook:', error);
    res.sendStatus(500);
  }
};