import { CommandHandler } from 'src/lib/cqrs/command-bus/command-bus.types';

import { Product } from '../models/product.models';
import { RestockProductCommand } from '../commands/restock-product.command';
import { restockProduct } from '../repository/product.repository';

export class RestockProductHandler implements CommandHandler<RestockProductCommand, Product> {
  commandType = 'RESTOCK_PRODUCT';

  async execute(command: RestockProductCommand): Promise<Product> {
    const updatedProduct = await restockProduct(command.payload.id);
    return updatedProduct;
  }
}
