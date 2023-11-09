import _ from 'lodash';
import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  title: z.string().min(1, 'Please enter First name').max(100).optional(),
  price: z.string().min(1, 'Please enter Last name').max(100).optional(),
}).strict();

interface ValidatedData extends z.infer<typeof schema> {
  passwordHash?: string | null;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;

  if (_.isEmpty(ctx.validatedData)) {
    ctx.body = userService.getPublic(user);

    return;
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  const updatedUser = await userService.updateOne(
    { _id: user._id },
    () => _.pickBy(ctx.validatedData),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(schema), validator, handler);
};
