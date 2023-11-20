import { validateMiddleware } from 'middlewares';
import { productsSchema } from 'schemas';
import Stripe from 'stripe';
import { AppKoaContext, AppRouter, User } from 'types';
import { z } from 'zod';

const schema = z.object({
  products: z.array(productsSchema),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

// interface StripeProduct {
//   price: string | Stripe.Price | null | undefined,
//   quantity: number,
// }

// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const stripe = new Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc', {
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
      price: prod.default_price!,
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
