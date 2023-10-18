import { z } from 'zod';

import { ProductSchema } from 'schemas';

export type Products = z.infer<typeof ProductsSchema>;
