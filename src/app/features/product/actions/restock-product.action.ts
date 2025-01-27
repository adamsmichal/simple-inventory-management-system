import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus/command-bus';

import { Product } from '../models/product.models';
import { RestockProductCommand } from '../commands/restock-product.command';

export const restockProductActionValidation = celebrate(
  {
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  },
  { abortEarly: false },
);

export const restockProductAction = (commandBus: CommandBus) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const updatedProduct = await commandBus.execute<RestockProductCommand, Product>(
        new RestockProductCommand({ id: Number(id) }),
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };
};
