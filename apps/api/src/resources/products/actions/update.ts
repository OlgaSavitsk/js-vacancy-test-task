import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import { productsSchema } from 'schemas';
import { AppKoaContext, AppRouter, ProductsType } from 'types';
import { z } from 'zod';
import productsService from '../products.service';

const schema = z.object({
  product: productsSchema.nullable(),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  await userService.updateMany({ _id: user._id }, () => ({
    cart: [],
  }));

  for (const item of user.cart) {
    await userService.updateProductStatus(user._id, item._id);
    await productsService.updateMany({ _id: item._id }, () => ({
      status: ProductsType.Sold,
    }));
  }

  ctx.body = user;
}

export default (router: AppRouter) => {
  router.post('/payment-success', validateMiddleware(schema), handler);
};
