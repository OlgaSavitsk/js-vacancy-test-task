import { validateMiddleware } from 'middlewares';
import { productsSchema } from 'schemas';
import Stripe from 'stripe';
import { AppKoaContext, AppRouter, User } from 'types';
import { z } from 'zod';

import config from 'config';

const schema = z.object({
  products: z.array(productsSchema),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

const stripe = new Stripe(config.STRIPE_SECRET_KEY as , {
  typescript: true,
  apiVersion: '2023-08-16',
});

const signInGoogleWithCode = async (ctx: AppKoaContext<ValidatedData>) => {
  const { products } = ctx.validatedData;

  const stripeItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const product of products) {
    const prod = await stripe.products.create({
      name: product.title as string,
      default_price_data: {
        unit_amount: parseInt(product.price as string, 10) * 100,
        currency: 'usd',
      },
    });

    stripeItems.push({
      price: prod.default_price as string,
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
