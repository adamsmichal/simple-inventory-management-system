import { QueryHandler } from 'src/lib/cqrs/query-bus';

import { GetProductsQuery } from '../queries/get-products.query';
import { Product } from '../models/product.models';
import { getAllProducts } from '../repository/product.repository';

export class GetProductsHandler implements QueryHandler<GetProductsQuery, Product[]> {
  queryType = 'GET_PRODUCTS';

  async execute(_query: GetProductsQuery): Promise<Product[]> {
    const products = await getAllProducts();
    return products;
  }
}
