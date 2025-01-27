import { Query } from 'src/lib/cqrs/query-bus';

import { GetProductsParams } from '../models/product.models';

export class GetProductsQuery implements Query<GetProductsParams> {
  type = 'GET_PRODUCTS';
  constructor(public params: GetProductsParams) {}
}
