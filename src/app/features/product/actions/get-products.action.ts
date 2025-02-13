import { NextFunction, Request, Response } from 'express';

import { QueryBus } from 'src/lib/cqrs/query-bus';

import { GetProductsQuery } from '../queries/get-products.query';
import { Product } from '../models/product.models';

export const getProductsAction = (queryBus: QueryBus) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await queryBus.execute<GetProductsQuery, Product[]>(new GetProductsQuery(req.query));
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
};
