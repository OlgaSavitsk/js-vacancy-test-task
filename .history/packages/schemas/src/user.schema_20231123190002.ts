import { z } from 'zod';

import dbSchema from './db.schema';

const productsSchema = dbSchema
  .extend({
    _id: z.string(),
    userId: z.string(),
    title: z.string().optional(),
    price: z.coerce.number().optional(),
    photoUrl: z.string().nullable().optional(),
    quantity: z.number().optional(),
  })
  .strict();

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
