const { processMessage } = require('../services/whatsapp.service');

exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry[0];
    const changes = entry.changes[0];
    const message = changes.value.messages?.[0];
    
    if (message) {
      await processMessage(message);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
};