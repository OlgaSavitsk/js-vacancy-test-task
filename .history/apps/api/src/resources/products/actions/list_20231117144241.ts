import { z } from 'zod';
import { AppKoaContext, AppRouter } from 'types';

import { productsService } from 'resources/products';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    price: z.object({
      payment_from: z.string(),
      payment_to: z.string(),
    }).nullable().default(null),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, filter,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  console.log(filter?.price?.payment_to as string);

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
        filter?.price ? {
          price: { $and: [ {
            $gte: filter.price.payment_from as string,
            $lte: filter.price.payment_to as string,
          },
        }]} : {},
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