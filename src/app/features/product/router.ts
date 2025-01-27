import express from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus';
import { QueryBus } from 'src/lib/cqrs/query-bus';

import { createProductAction, createProductActionValidation } from './actions/create-product.action';
import { getProductsAction } from './actions/get-products.action';
import { restockProductAction, restockProductActionValidation } from './actions/restock-product.action';
import { sellProductAction, sellProductActionValidation } from './actions/sell-product.action';

interface CreateProductRouting {
  commandBus: CommandBus;
  queryBus: QueryBus;
}

export const creteProductRouting = ({ commandBus, queryBus }: CreateProductRouting) => {
  const router = express.Router();

  router.post('/', [createProductActionValidation], createProductAction(commandBus));
  router.get('/', [], getProductsAction(queryBus));
  router.post('/:id/restock', [restockProductActionValidation], restockProductAction(commandBus));
  router.post('/:id/sell', [sellProductActionValidation], sellProductAction(commandBus));

  return router;
};
