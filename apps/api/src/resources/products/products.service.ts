import { Products } from 'types';
import { productsSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';

const service = db.createService<Products>(DATABASE_DOCUMENTS.PRODUCTS, {
  schemaValidator: (obj) => productsSchema.parseAsync(obj),
});

const updateLastRequest = (_id: string) => {
  return service.atomic.updateOne(
    { _id },
    {
      $set: {
       userId: _id,
      },
    },
  );
};

export default Object.assign(service, {
  updateLastRequest,
});