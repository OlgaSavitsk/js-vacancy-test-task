import { z } from 'zod';

import { ProductsSchema } from 'schemas';

export type User = z.infer<typeof userSchema>;

export interface ProductsInfo {
  title: string;
  price: string;
  photoUrl?: string | null;
}
