import { z } from 'zod';
import { AppKoaContext, Next, AppRouter, User, ProductsType } from 'types';

import { validateMiddleware } from 'middlewares';

import { userService } from 'resources/user';
import { productsService } from 'resources/products';

const schema = z.object({
  title: z.string().optional(),
  price: z.coerce.number(),
  photoUrl: z.string().nullable().optional(),
  userId: z.string().optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { userId, title } = ctx.validatedData;

  const user = await userService.findOne({ _id: userId });
  const isProductExists = await productsService.exists({ title });

  if (!user) return (ctx.body = {});

  ctx.validatedData.user = user;

  ctx.assertClientError(!isProductExists, {
    title: 'Product with this title already exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { title, price, user, photoUrl } = ctx.validatedData;

  const product = await productsService.insertOne({
    title,
    price,
    photoUrl: photoUrl,
    userId: user._id,
    status: ProductsType.OnSale,
  });

  await userService.updateOne({ _id: user._id }, (old) => ({
    products: [...old.products, product],
  }));
 
  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
