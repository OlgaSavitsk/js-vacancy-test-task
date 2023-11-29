import { z } from 'zod';
import { productsSchema } from './products.schema';

import dbSchema from './db.schema';

export const userSchema = dbSchema
  .extend({
    email: z.string(),
    passwordHash: z.string().nullable().optional(),

    isEmailVerified: z.boolean().default(false),
    isShadow: z.boolean().optional().nullable(),

    signupToken: z.string().nullable().optional(),
    resetPasswordToken: z.string().nullable().optional(),

    avatarUrl: z.string().nullable().optional(),
    oauth: z
      .object({
        google: z.boolean().default(false),
      })
      .optional(),
    products: z.array(productsSchema),
    cart: z.array(productsSchema).default([]),

    lastRequest: z.date().optional(),
  })
  .strict();
