const contactService = require('../services/contact.service');

async function submit(req, res, next) {
  try {
    const message = await contactService.submitMessage(req.validatedBody);
    res.status(201).json({ success: true, id: message.$id });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit };
