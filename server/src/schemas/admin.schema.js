const { z } = require('zod');

const assignDonationSchema = z.object({
  volunteerId: z.string().min(1),
});

const updateMessageStatusSchema = z.object({
  status: z.enum(['read', 'replied']),
});

module.exports = { assignDonationSchema, updateMessageStatusSchema };
