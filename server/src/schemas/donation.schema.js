const { z } = require('zod');

const donationSchema = z.object({
  title: z.string().min(3).max(256),
  description: z.string().min(10).max(2048),
  category: z.enum(['alzheimers', 'parkinsons', 'cerebral_palsy', 'elderly', 'general']),
  itemCondition: z.enum(['new', 'excellent', 'good', 'fair']),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
  gender: z.enum(['men', 'women', 'unisex']).optional(),
  city: z.string().max(64).optional(),
  images: z.string().max(2048).optional(),
});

module.exports = { donationSchema };
