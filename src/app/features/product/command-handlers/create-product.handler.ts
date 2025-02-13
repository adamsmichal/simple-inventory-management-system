import { CommandHandler } from 'src/lib/cqrs/command-bus/command-bus.types';

import { createProduct } from '../repository/product.repository';
import { CreateProductPayload, Product } from '../models/product.models';
import { CreateProductCommand } from '../commands/create-product.command';

export class CreateProductHandler implements CommandHandler<CreateProductCommand, Product> {
  commandType = 'CREATE_PRODUCT';

  async execute(command: CreateProductCommand): Promise<Product> {
    const { name, description, price, stock } = command.payload;

    const newProduct: CreateProductPayload = {
      name,
      description,
      price,
      stock,
    };

    const dbProduct = await createProduct(newProduct);

    return dbProduct;
  }
}
