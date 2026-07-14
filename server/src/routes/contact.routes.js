const { Router } = require('express');
const { validate } = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');
const { contactSchema } = require('../schemas/contact.schema');
const contactController = require('../controllers/contact.controller');

const router = Router();

router.post('/', contactLimiter, validate(contactSchema), contactController.submit);

module.exports = router;
