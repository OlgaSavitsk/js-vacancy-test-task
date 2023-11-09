import { routeUtil } from 'utils';
import create from './actions/create';
import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([
  list
]);

const privateRoutes = routeUtil.getRoutes([
  create,
  list,
  update,
  remove,
]);

const adminRoutes = routeUtil.getRoutes([
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};