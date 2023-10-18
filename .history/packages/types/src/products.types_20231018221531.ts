import { z } from 'zod';

import { ProductsSchema } from 'schemas';

export type Products = z.infer<typeof ProductsSchema>;

