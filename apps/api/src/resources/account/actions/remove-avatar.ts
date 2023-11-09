import { AppKoaContext, AppRouter } from 'types';

import { cloudStorageService } from 'services';
import { z } from 'zod';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
  photoUrl: z.string().nullable().optional(),
});

type ValidatedData = z.infer<typeof schema>


async function handler(ctx: AppKoaContext<ValidatedData>) {
  
  const { photoUrl } = ctx.validatedData;

   const updatedProduct = await new Promise(resolve =>
    resolve(cloudStorageService.deleteFile(photoUrl || '')),
  );

  ctx.body = updatedProduct;
}

export default (router: AppRouter) => {
  router.delete('/avatar', validateMiddleware(schema), handler);
};
