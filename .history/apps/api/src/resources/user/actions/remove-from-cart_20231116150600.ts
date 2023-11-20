import { AppKoaContext, AppRouter, Next } from 'types';

import { productsService } from 'resources/products';
import { userService } from 'resources/user';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isProductExists = await productsService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isProductExists, 'Product not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {

  console.log('22222', ctx.request.params.id);

  await userService.updateMany({ _id: ctx.state.user._id }, (old) => ({
    cart: [...old.products.filter((product) => product._id !== ctx.request.params.id)],
  }));

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/cart/:id', validator, handler);
};