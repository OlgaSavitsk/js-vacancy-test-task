import { z } from 'zod';
import { AppKoaContext, AppRouter } from 'types';

import { validateMiddleware } from 'middlewares';

import { productsService } from 'resources/products';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']),
  }).default({ createdOn: 'desc' }),
  price: z.object({
    paymentFrom: z.string(),
    paymentTo: z.string(),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, price,
  } = ctx.validatedData;

  const { paymentFrom, paymentTo } = price || undefined;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const products = await productsService.find(
    {
      $and: [
        {
          $or: [
            { title: { $regex: regExp } },
            { price: { $regex: regExp } },
            { createdOn: {} },
          ],
        },
        price ? {
          price: {
            $gte: parseInt(paymentFrom, 10),
            $lte: parseInt(paymentTo, 10),
          },
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    products: products.results,
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};