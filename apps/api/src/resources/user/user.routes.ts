import { routeUtil } from 'utils';

import list from './actions/list';
import addToCart from './actions/add-to-cart';
import removeFromCart from './actions/remove-from-cart';
import remove from './actions/remove';
import update from './actions/update';

const publicRoutes = routeUtil.getRoutes([
  addToCart,
]);

const privateRoutes = routeUtil.getRoutes([
  list,
  addToCart,
  removeFromCart,
  update,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
  remove,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
