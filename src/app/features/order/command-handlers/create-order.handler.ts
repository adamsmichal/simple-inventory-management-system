import { CommandHandler } from 'src/lib/cqrs/command-bus';
import { findProductsByIds } from 'src/app/features/product/repository/product.repository';

import { Order } from '../model/order.model';
import { CreateOrderCommand } from '../commands/create-order.command';
import { createOrderTransaction } from '../repository/order.repository';
import { ProductTransaction, Product, ExtendedProduct } from '../../product/models/product.models';
import { StockError } from '../../product/errors/stock.error';
import { NotFoundError } from 'src/errors/not-found.error';

export class CreateOrderHandler implements CommandHandler<CreateOrderCommand, Order> {
  commandType = 'CREATE_ORDER';

  async execute(command: CreateOrderCommand): Promise<Order> {
    const { customerId, products } = command.payload;

    const dbPoducts = await findProductsByIds(products.map(p => p.productId));

    const newOrder = await createOrderTransaction({
      customerId,
      processedProducts: products,
      rawProducts: dbPoducts,
      processProductsCallback: this.processProductsForOrder,
    });

    return newOrder;
  }

  private processProductsForOrder = (
    payloadProducts: ProductTransaction[],
    products: Product[],
  ): { extendedProducts: ExtendedProduct[]; total: number } => {
    let total = 0;

    const extendedProducts = payloadProducts.map(({ productId, quantity }) => {
      const product = products.find(p => p.id === productId);

      if (!product) {
        throw new NotFoundError(`Product with ID ${productId} not found`);
      }

      if (product.stock < quantity) {
        throw new StockError(product.id);
      }

      total += product.price * quantity;

      return {
        productId,
        quantity,
        price: product.price,
      };
    });

    return { extendedProducts, total };
  };
}
