import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, User, Products } from 'types';
import { productsSchema } from 'schemas';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import _ from 'lodash';

const schema = z.object({
  product: productsSchema,
});

interface ValidatedData extends z.infer<typeof schema> {
  cartProducts: Products[];
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    product: { _id, userId },
  } = ctx.validatedData;

  const productInCart = await userService.findOne({
    _id: userId,
    cart: { $elemMatch: { _id: _id } },
  });

  if (productInCart) return ctx.body = {};



  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { cartProducts, product } = ctx.validatedData;

  if (cartProducts) {
    const index = _.findIndex(cartProducts, ['_id', product._id]);
    userService.increaseQuantity(product.userId, cartProducts[index]);
  } else {
    await userService.updateMany({ _id: product.userId }, ({ cart }) => ({
      cart: [...cart, { ...product, quantity: 1 }],
    }));
  }

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
