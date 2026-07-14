const { z } = require('zod');

const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).optional().default(1),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(0).max(10),
});

const mergeCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(10).optional().default(1),
  })).min(1).max(50),
});

module.exports = { addItemSchema, updateQuantitySchema, mergeCartSchema };
