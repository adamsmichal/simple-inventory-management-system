import { prisma } from 'src/config/db';

import { CreateOrderDbPayload, Order, CreateOrderDbTransactionPayload } from '../model/order.model';
import { updateProductStock } from '../../product/repository/product.repository';

export const createOrder = ({ customerId, total, extendedProducts }: CreateOrderDbPayload): Promise<Order> => {
  return prisma.order.create({
    data: {
      customerId: customerId,
      total: total,
      orderItems: {
        create: extendedProducts.map(({ productId, quantity, price }) => ({
          product: {
            connect: {
              id: productId,
            },
          },
          quantity,
          price,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });
};

export const createOrderTransaction = async ({
  customerId,
  rawProducts,
  processedProducts,
  processProductsCallback,
}: CreateOrderDbTransactionPayload): Promise<Order> => {
  return await prisma.$transaction(async _ => {
    const { extendedProducts, total } = processProductsCallback(processedProducts, rawProducts);

    for (const { productId, quantity } of extendedProducts) {
      await updateProductStock(productId, quantity);
    }
    return createOrder({ customerId, total, extendedProducts });
  });
};
