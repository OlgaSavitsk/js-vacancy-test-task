import { z } from 'zod';

import dbSchema from './db.schema';

export const userSchema = dbSchema.extend({
  title: z.string(),
  price: z.string(),
  photoUrl: z.string().nullable().optional(),
}).strict();
