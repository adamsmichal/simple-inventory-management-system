import express from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus';
import { QueryBus } from 'src/lib/cqrs/query-bus';
import { registerHandlers } from 'src/lib/cqrs/handlers-register';

import { creteProductRouting } from 'src/app/features/product/router';
import { creteOrderRouting } from 'src/app/features/order/router';

export const createRouter = async () => {
  const router = express.Router();
  const commandBus = new CommandBus();
  const queryBus = new QueryBus();

  await registerHandlers(commandBus);
  await registerHandlers(queryBus);

  router.use('/products', creteProductRouting({ commandBus, queryBus }));
  router.use('/orders', creteOrderRouting({ commandBus }));

  return router;
};
