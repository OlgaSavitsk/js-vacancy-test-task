import { z } from 'zod';
import dbSchema from './db.schema';

export const productsSchema = dbSchema
  .extend({
    _id: z.string(),
    userId: z.string().optional(),
    title: z.string().optional(),
    price: z.coerce.number().optional(),
    photoUrl: z.string().nullable().optional(),
    quantity: z.number().optional(),
    status: z
      .union([z.literal('On sale'), z.literal('Sold')])
      .default('On sale')
      .optional(),
  })
  .strict();

export const productCreateParamsSchema = z.object({
  title: z.string().min(1, 'Please enter Title').max(50),
  price: z.preprocess((a) => parseInt(String(a), 10), z.number()),
  photoUrl: z.string({
    required_error: 'Photo field is required',
  }),
});

export type ProductCreateParams = z.infer<typeof productCreateParamsSchema> & {
  userId: string,
  credentials?: string
};
