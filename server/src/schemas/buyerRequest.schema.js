const { z } = require('zod');

const buyerRequestSchema = z.object({
  category: z.enum(['alzheimers', 'parkinsons', 'cerebral_palsy', 'elderly', 'general']),
  adaptiveType: z.enum(['magnetic_closure', 'velcro', 'side_zip', 'open_back', 'elastic_waist', 'front_flap', 'pull_on']).optional(),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
  medicalCondition: z.string().max(64).optional(),
  urgency: z.enum(['low', 'medium', 'high']),
  maxBudget: z.number().positive().optional(),
});

module.exports = { buyerRequestSchema };
