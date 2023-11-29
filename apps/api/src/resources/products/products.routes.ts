import { routeUtil } from 'utils';
import create from './actions/create';
import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';
import payment from './actions/payment';

const publicRoutes = routeUtil.getRoutes([
  list,
]);

const privateRoutes = routeUtil.getRoutes([
  create,
  list,
  update,
  remove,
  payment,
]);

const adminRoutes = routeUtil.getRoutes([
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};