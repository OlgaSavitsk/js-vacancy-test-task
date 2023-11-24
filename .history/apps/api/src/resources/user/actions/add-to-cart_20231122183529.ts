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
    product: { userId },
  } = ctx.validatedData;

  const user = await userService.findOne({ _id: userId });

  if (!user) return (ctx.body = {});

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, product } = ctx.validatedData;

  const productInCart = await userService.findOne({ _id: user._id, cart: { $elemMatch: { _id: product._id } } });
  

  await userService.updateOne({ _id: user._id }, (old) => ({
    cart: [...old.cart, product ],
  }));

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
