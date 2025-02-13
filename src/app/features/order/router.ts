import express from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus';

import { createOrderAction, createOrderActionValidation } from './actions/create-order.action';

interface CreateOrderRouting {
  commandBus: CommandBus;
}

export const creteOrderRouting = ({ commandBus }: CreateOrderRouting) => {
  const router = express.Router();

  router.post('/', [createOrderActionValidation], createOrderAction(commandBus));

  return router;
};
