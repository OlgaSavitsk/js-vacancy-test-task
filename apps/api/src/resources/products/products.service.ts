import { Products, ProductsType } from 'types';
import { productsSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';
import _ from 'lodash';

const service = db.createService<Products>(DATABASE_DOCUMENTS.PRODUCTS, {
  schemaValidator: (obj) => productsSchema.parseAsync(obj),
});

const updateAfterPayment = (_id: string) => {
  return service.atomic.updateOne(
    { },
    { $pull: { $elemMatch: { _id: _id } } },
  );
};

const getProductsOnSale = (products: Products[]) => _.filter(products, { status: ProductsType.OnSale });

export default Object.assign(service, {
  updateAfterPayment,
  getProductsOnSale,
});