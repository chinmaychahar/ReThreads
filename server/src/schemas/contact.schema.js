const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(2).max(128),
  email: z.string().email(),
  message: z.string().min(10).max(4096),
});

module.exports = { contactSchema };
