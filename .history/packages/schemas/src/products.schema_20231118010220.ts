import { z } from 'zod';
import dbSchema from './db.schema';

export const productsSchema = dbSchema
  .extend({
    _id: z.string(),
    userId: z.string().optional(),
    title: z.string().optional(),
    price:z.union([z.number(), z.string()]).optional(),
    photoUrl: z.string().nullable().optional(),
    quantity: z.number().default(1),
  })
  .strict();
