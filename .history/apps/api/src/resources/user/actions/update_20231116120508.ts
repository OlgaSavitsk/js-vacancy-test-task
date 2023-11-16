import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';

import { productsService } from 'resources/products';
import { validateMiddleware } from 'middlewares';
import userService from '../user.service';

const schema = z.object({
  quantity: z.number(),
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
  const isProductExists = await productsService.exists({
    _id: ctx.request.params.id,
  });

  ctx.assertError(isProductExists, 'Products not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { quantity } = ctx.validatedData;

  await userService.updateQuantity(
    ctx.state.user._id,
    ctx.request.params?.id,
    quantity!,
  );

  const user = await userService.findOne({ _id: ctx.state.user._id });

  if (!user) return (ctx.body = {});

  ctx.body = user.cart;
}

export default (router: AppRouter) => {
  router.put('/cart/:id', validator, validateMiddleware(schema), handler);
};
