import { z } from "zod";

import { AppKoaContext, Next, AppRouter, User } from "types";

import { userService } from "resources/user";

import { validateMiddleware } from "middlewares";
import { productsSchema } from "schemas";

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

  const user = await userService.findOne({ _id: userId });

  if (!user) return (ctx.body = {});

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, product } = ctx.validatedData;

  await userService.updateOne({ _id: user._id }, (old) => ({
    cart: [...old.cart, product],
  }));

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/cart', validateMiddleware(schema), validator, handler);
};
