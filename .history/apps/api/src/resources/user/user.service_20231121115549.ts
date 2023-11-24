import _ from 'lodash';

import { User } from 'types';
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
  return service.atomic.updateOne(
    { _id },
    
    (old: User) => ({
      cart: [...old.cart.filter((product) => product._id !== productId)],
    }),
  );
};

const updateQuantity = (_id: string, id: string, quantity: number) => {
  return service.atomic.updateOne(
    { _id, cart: { $elemMatch: { _id: id } } },
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
