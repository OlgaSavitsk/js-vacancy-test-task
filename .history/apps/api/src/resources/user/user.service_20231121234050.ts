import _ from 'lodash';

import { User } from 'types';
import { userSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

const updateLastRequest = (id: string) => {
  return service.atomic.updateOne(
    { id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
};

const updateCart = (id: string, productId: string) => {
  return service.atomic.updateMany(
    { id }, 
    {
      $pull: {
        'cart: { '_id': productId } },
    },
    { skipDeletedOnDocs: true },
    // { arrayFilters: [ { 'cart': { '_id': { '$ne':  productId } } }], upsert: true },
  );
};

const updateQuantity = (id: string, _id: string, quantity: number) => {
  return service.atomic.updateMany(
    { id, cart: { $elemMatch: { _id: _id } } },
    { $set: { 'cart.$.quantity': quantity } },
  );
};

const privateFields = ['passwordHash', 'signupToken', 'resetPasswordToken'];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
  updateQuantity,
  updateCart,
});
