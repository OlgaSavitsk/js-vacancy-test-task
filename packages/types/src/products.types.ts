import { z } from 'zod';

import { productsSchema } from 'schemas';

export type Products = z.infer<typeof productsSchema>;
