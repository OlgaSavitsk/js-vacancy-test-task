import { z } from 'zod';
import _ from 'lodash';

import { AppKoaContext, Next, AppRouter, Products } from 'types';
import { productsSchema } from 'schemas';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  product: productsSchema,
});

interface ValidatedData extends z.infer<typeof schema> {
  cartProducts: Products[];
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { product } = ctx.validatedData;
  const { user } = ctx.state;

  const productInCart = await userService.findOne({
    _id: user._id,
    cart: { $elemMatch: { _id: product._id } },
  });

  if (productInCart) ctx.validatedData.cartProducts = productInCart.cart;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { cartProducts, product } = ctx.validatedData;
  const { user } = ctx.state;

  if (cartProducts) {
    const index = _.findIndex(cartProducts, ['_id', product._id]);
    userService.increaseQuantity(user._id, cartProducts[index]);
  } else {
    await userService.updateMany({ _id: user._id }, ({ cart }) => ({
      cart: [...cart, { ...product, quantity: 1 }],
    }));
  }

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
