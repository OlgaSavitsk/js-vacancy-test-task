import { validateMiddleware } from 'middlewares';
import { productsSchema } from 'schemas';
import { AppKoaContext, AppRouter, Products, User } from 'types';
import { z } from 'zod';

const schema = z.object({
  products: z.array(productsSchema).optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const signInGoogleWithCode = async (ctx: AppKoaContext<ValidatedData>) => {
  const { products } = ctx.validatedData;
  
  // const checkProducts = await stripe.products.list();

  // console.log(checkProducts)

  const stripeItems: Pick<Products, 'price', 'quantity'>[] = [];

  for (const product of products!) {
    const prod = await stripe.products.create({
      name: product.title,
      default_price_data: {
        unit_amount: +product.price! * 100,
        currency: 'usd',
      },
    });
    console.log('prod', prod);
    stripeItems.push({
      price: prod.default_price,
      quantity: product.quantity,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: stripeItems,
      mode: 'payment',
      success_url: `${ctx.request.headers.origin}/success/?success=true`,
      cancel_url: `${ctx.request.headers.origin}/failed/?canceled=true`,
    });
    ctx.body = { sessionId: session.id };
  }
};

export default (router: AppRouter) => {
  router.post('/payment', validateMiddleware(schema), signInGoogleWithCode);
};
