import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus/command-bus';

import { CreateOrderCommand } from '../commands/create-order.command';
import { Order } from '../model/order.model';

export const createOrderActionValidation = celebrate(
  {
    body: Joi.object().keys({
      customerId: Joi.string().required(),
      products: Joi.array().items({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
      }),
    }),
  },
  { abortEarly: false },
);

export const createOrderAction = (commandBus: CommandBus) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId, products } = req.body;

      const newOrder = await commandBus.execute<CreateOrderCommand, Order>(
        new CreateOrderCommand({ customerId, products }),
      );

      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  };
};
