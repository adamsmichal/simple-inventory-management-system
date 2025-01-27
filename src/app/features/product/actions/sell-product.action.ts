import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus/command-bus';

import { Product } from '../models/product.models';
import { SellProductCommand } from '../commands/sell-product.command';

export const sellProductActionValidation = celebrate(
  {
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  },
  { abortEarly: false },
);

export const sellProductAction = (commandBus: CommandBus) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const updatedProduct = await commandBus.execute<SellProductCommand, Product>(
        new SellProductCommand({ id: Number(id) }),
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };
};
