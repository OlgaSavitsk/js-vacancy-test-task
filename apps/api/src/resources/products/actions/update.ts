import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { productsService } from 'resources/products';

const schema = z.object({
  title: z.string().min(1, 'Please enter First name').max(100),
  price: z.string().min(1, 'Please enter Last name').max(100),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  };
};

async function validator(
  ctx: AppKoaContext<ValidatedData, Request>,
  next: Next,
) {
  const isUserExists = await userService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { title, price } = ctx.validatedData;

  const updatedProduct = await productsService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({
      title, price,
    }),
  );

  ctx.body = updatedProduct;
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
