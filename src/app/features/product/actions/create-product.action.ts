import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

import { CommandBus } from 'src/lib/cqrs/command-bus/command-bus';

import { CreateProductCommand } from '../commands/create-product.command';
import { Product } from '../models/product.models';

export const createProductActionValidation = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().required().max(50),
      description: Joi.string().required().max(50),
      price: Joi.number().positive().required(),
      stock: Joi.number().min(0).required(),
    }),
  },
  { abortEarly: false },
);

export const createProductAction = (commandBus: CommandBus) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, stock } = req.body;

      const newProduct = await commandBus.execute<CreateProductCommand, Product>(
        new CreateProductCommand({ name, description, price, stock }),
      );

      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };
};
