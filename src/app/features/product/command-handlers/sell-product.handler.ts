import { CommandHandler } from 'src/lib/cqrs/command-bus/command-bus.types';

import { Product } from '../models/product.models';
import { SellProductCommand } from '../commands/sell-product.command';
import { getProductById, sellProduct } from '../repository/product.repository';
import { NotFoundError } from 'src/errors/not-found.error';
import { StockError } from '../errors/stock.error';

export class SellProductHandler implements CommandHandler<SellProductCommand, Product> {
  commandType = 'SELL_PRODUCT';

  async execute(command: SellProductCommand): Promise<Product> {
    const product = await getProductById(Number(command.payload.productId));

    if (!product) {
      throw new NotFoundError(`Product with id ${command.payload.productId} not found`);
    }

    if (product.stock <= 0) {
      throw new StockError(product.id);
    }

    const updatedProduct = await sellProduct(product.id);

    return updatedProduct;
  }
}
