import { z } from 'zod';

import dbSchema from './db.schema';

export const userSchema = dbSchema.extend({
  title:  z.string(),
  price:  z.string(),
  photoUrl: z.string().nullable().optional(),
  email: z.string(),
  passwordHash: z.string().nullable().optional(),

  isEmailVerified: z.boolean().default(false),
  isShadow: z.boolean().optional().nullable(),

  signupToken: z.string().nullable().optional(),
  resetPasswordToken: z.string().nullable().optional(),

  avatarUrl: z.string().nullable().optional(),
  oauth: z.object({
    google: z.boolean().default(false),
  }).optional(),

  lastRequest: z.date().optional(),
}).strict();