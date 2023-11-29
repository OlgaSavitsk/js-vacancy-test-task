import { AppKoaContext, Next } from 'types';

import { userService } from 'resources/user';
import { tokenService } from 'resources/token';
import { productsService } from 'resources/products';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  const accessToken = ctx.state.accessToken;
  let userData;

  if (accessToken) {
    userData = await tokenService.findTokenByValue(accessToken);
  }

  if (userData && userData.userId) {
    const user = await userService.findOne({ _id: userData.userId });
    const products = await productsService.find({ userId: user?._id });

    if (user) {
      await userService.updateLastRequest(userData.userId);

      ctx.state.user = user;
      ctx.state.products = products.results ?? [];
      ctx.state.isShadow = userData.isShadow || false;
    }
  }

  return next();
};

export default tryToAttachUser;
