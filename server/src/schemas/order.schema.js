const { z } = require('zod');

const orderSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(10),
    email: z.string().email(),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(5),
  }),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'upi']),
});

module.exports = { orderSchema };
