import _ from 'lodash';

import { User } from 'types';
import { userSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';
import { ObjectId } from '@paralect/node-mongo';

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

// const updateCart = (_id: string, productId: string) => {
//   return service.updateMany(
//     { _id }, 
//     (old) => ({
//       cart: [...old.cart.filter((product) => product._id !== productId)],
//     }),
//   );
// };

const updateCart = (_id: string, productId: string) => {
  return service.atomic.updateMany(
    { _id, cart: { $elemMatch: { _id: productId } } }, 
    {
      $setOnInsert: { 'cart.$.updatedOn': new Date() },
      // $set: { 'cart.$.updatedOn': new Date() },
      $pull: { 'cart.$._id': productId },
    },
    {},
    {
      arrayFilters: [{ "pkg10.id": 1 }]
},
  );
};

const updateQuantity = (_id: string, id: string, quantity: number) => {
  return service.atomic.updateMany(
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
