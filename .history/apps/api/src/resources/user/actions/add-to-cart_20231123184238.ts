import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, User } from 'types';
import { productsSchema } from 'schemas';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import _ from 'lodash';

const schema = z.object({
  product: productsSchema,
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const {
    product: { userId },
  } = ctx.validatedData;

  const productInCart = await userService.findOne({
    _id: user._id,
    cart: { $elemMatch: { _id: product._id } },
  });

  if (!user) return (ctx.body = {});

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, product } = ctx.validatedData;

 
  if (productInCart) {
    const index = _.findIndex(user.cart, ['_id', product._id]);
    userService.increaseQuantity(user._id, productInCart.cart[index]);
  } else {
    await userService.updateMany({ _id: user._id }, ({ cart }) => ({
      cart: [...cart, { ...product, quantity: 1 }],
    }));
  }

  ctx.body = user;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
