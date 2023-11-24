import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, User, Products } from 'types';
import { productsSchema } from 'schemas';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  product: productsSchema,
});

interface ValidatedData extends z.infer<typeof schema> {
  cart: Products[];
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    product: { _id, userId },
  } = ctx.validatedData;

  const user = await userService.findOne({ _id: userId });

  if (!user) return (ctx.body = {});

  const productInCart = await userService.findOne({ _id: user._id, cart: { $elemMatch: { _id: _id } } });

  ctx.validatedData.cart = user.cart;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, product } = ctx.validatedData;

  if (!user.cart.length) {
    await userService.updateOne(
      { _id: user._id },
      ({ cart }) => ({
        cart: [...cart, /* productInCart ? { ...product, quantity: product.quantity + 1 } :  */ product ],
      }),
    );
  } else {

  }

  // if (productInCart) {
  //   await userService.atomic.updateOne(
  //     { _id: user._id, cart: { $elemMatch: { _id: product._id } } },
  //     { $inc: { 'cart.$.quantity':  1 } },
  //   );
  // }

  

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
