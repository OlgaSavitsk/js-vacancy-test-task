import { z } from 'zod';

import dbSchema from './db.schema';

export const ProductSchema = dbSchema.extend({
  title: z.string(),
  price: z.string(),
  photoUrl: z.string().nullable().optional(),
}).strict();
