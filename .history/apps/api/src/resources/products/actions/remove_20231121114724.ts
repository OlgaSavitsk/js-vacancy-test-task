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
  const isUserExists = await productsService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isUserExists, 'Product not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  await productsService.deleteSoft({ _id: ctx.request.params.id });

  await userService.updateOne({ _id: ctx.state.user._id }, (old) => ({
    products: [...old.products.filter((product) => 
      product._id !== ctx.request.params.id)],
      cart
  }));

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};
