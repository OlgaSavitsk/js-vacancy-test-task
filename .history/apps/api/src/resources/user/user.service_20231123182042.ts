import _ from 'lodash';

import { Products, User } from 'types';
import { userSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

const updateLastRequest = (_id: string) => {
  return service.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
};

const updateCart = (_id: string, productId: string) => {
  return service.updateMany({ _id }, ({ cart }) => ({
    cart: [..._.pullAllBy(cart, [{ _id: productId }], '_id')],
  }));
};

const updateQuantity = (_id: string, productId: string, quantity: number) => {
  return service.atomic.updateMany(
    { _id, cart: { $elemMatch: { _id: productId } } },
    { $set: { 'cart.$.quantity': quantity } },
  );
};

const increaseQuantity = (_id: string, productInCart: Products) => {
  // return service.atomic.updateMany(
  //   { _id: _id, cart: { $elemMatch: { _id: product._id } } },
  //   { $set: { updatedOn: new Date(), 'cart.$.quantity': product.quantity! + 1 } },
  //   // {},
  //   // { arrayFilters: [{ 'el._id': product._id }] },
  // );
  product = {
    ...product,
    quantity: product.quantity ? product.quantity + 1 : product.quantity,
  };
  return service.updateMany({ _id }, ({ cart }) => ({
    cart: [
      ..._.map(cart, (item) => (item._id === product._id ? product : item)),
    ],
  }));
};

const privateFields = ['passwordHash', 'signupToken', 'resetPasswordToken'];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
  updateQuantity,
  updateCart,
  increaseQuantity,
});
