import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, User } from 'types';
import { productsSchema } from 'schemas';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  product: productsSchema,
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    product: { _id, userId },
  } = ctx.validatedData;

  const user = await userService.findOne({ _id: userId });

  if (!user) return (ctx.body = {});

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, product } = ctx.validatedData;

  // if (!user.cart.length) {
  //   await userService.updateMany(
  //     { _id: user._id },
  //     ({ cart }) => ({
  //       cart: [...cart, /* productInCart ? { ...product, quantity: product.quantity + 1 } :  */ product ],
  //     }),
  //   );
  // } else {
  const productInCart = await userService.findOne({ _id: user._id, cart: { $elemMatch: { _id: product._id } } });
  if (productInCart) {
    // await userService.increaseQuantity(user._id, product);
    await userService.updateMany(
      { _id: user._id }, 
      ({ cart }) => ({
        cart: [{ _.find(cart, [ '_id', product._id ]) }],
      }),
    );
  } else {
    await userService.updateMany(
      { _id: user._id },
      ({ cart }) => ({
        cart: [...cart, /* productInCart ? { ...product, quantity: product.quantity + 1 } :  */ product ],
      }),
    );
  }  
  // }

  // if (productInCart) {
  //   await userService.atomic.updateOne(
  //     { _id: user._id, cart: { $elemMatch: { _id: product._id } } },
  //     { $inc: { 'cart.$.quantity':  1 } },
  //   );
  // }

  console.log('cart', user.cart);

  ctx.body = user.cart;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
