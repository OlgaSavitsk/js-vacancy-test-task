import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, User } from 'types';

import { userService } from 'resources/user';
import { productsService } from 'resources/products';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  title: z.string().optional(),
  price: z.number().optional(),
  photoUrl: z.string().nullable().optional(),
  userId: z.string().optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { userId } = ctx.validatedData;

  const user = await userService.findOne({ _id: userId });

  if (!user) return (ctx.body = {});

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { title, price, user, photoUrl } = ctx.validatedData;

  console.log('price', price);

  const product = await productsService.insertOne({
    title,
    price: parseInt(price as string, 10),
    photoUrl: photoUrl,
    userId: user._id,
  });

  await userService.updateOne({ _id: user._id }, (old) => ({
    products: [...old.products, product],
  }));
 
  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
