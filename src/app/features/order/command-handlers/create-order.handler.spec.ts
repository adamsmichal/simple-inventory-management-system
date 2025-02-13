import { CreateOrderHandler } from './create-order.handler';
import { CreateOrderCommand } from '../commands/create-order.command';
import { createOrderTransaction } from '../repository/order.repository';

import { findProductsByIds } from 'src/app/features/product/repository/product.repository';
import { StockError } from 'src/app/features/product/errors/stock.error';
import { NotFoundError } from 'src/errors/not-found.error';
import { ProductTransaction, Product } from '../../product/models/product.models';
import { ExtendedProduct, Order } from '../model/order.model';

jest.mock('../repository/order.repository', () => ({
  createOrderTransaction: jest.fn(),
}));
jest.mock('src/app/features/product/repository/product.repository', () => ({
  findProductsByIds: jest.fn(),
}));

const mockCreateOrderTransaction = createOrderTransaction as jest.MockedFunction<typeof createOrderTransaction>;
const mockFindProductsByIds = findProductsByIds as jest.MockedFunction<typeof findProductsByIds>;

const mockedProduct: Product = {
  id: 1,
  name: 'Product 1',
  description: 'Description 1',
  price: 100,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateOrderHandler', () => {
  let handler: CreateOrderHandler;

  beforeEach(() => {
    handler = new CreateOrderHandler();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create an order successfully', async () => {
    const command = new CreateOrderCommand({
      customerId: '123',
      products: [{ productId: 1, quantity: 2 }],
    });

    mockFindProductsByIds.mockResolvedValue([mockedProduct]);
    mockCreateOrderTransaction.mockResolvedValue({ id: 'order-1', total: 200 } as Order);

    const result = await handler.execute(command);

    expect(mockFindProductsByIds).toHaveBeenCalledWith([1]);
    expect(mockCreateOrderTransaction).toHaveBeenCalledWith({
      customerId: '123',
      processedProducts: command.payload.products,
      rawProducts: [mockedProduct],
      processProductsCallback: expect.any(Function),
    });
    expect(result).toEqual({ id: 'order-1', total: 200 });
  });

  it('should throw StockError when stock is insufficient', async () => {
    const command = new CreateOrderCommand({
      customerId: '123',
      products: [{ productId: 1, quantity: 20 }],
    });

    mockFindProductsByIds.mockResolvedValue([mockedProduct]);

    mockCreateOrderTransaction.mockImplementation(() => {
      throw new StockError(1);
    });

    await expect(handler.execute(command)).rejects.toThrow(StockError);
  });
});

describe('processProductsForOrder', () => {
  let handler: CreateOrderHandler;

  beforeEach(() => {
    handler = new CreateOrderHandler();
  });

  const products: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description 2',
      price: 50,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should calculate total and return extended products', () => {
    const productTransaction: ProductTransaction[] = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ];

    const result = handler['processProductsForOrder'](productTransaction, products);

    expect(result.total).toBe(350);
    expect(result.extendedProducts).toEqual<ExtendedProduct[]>([
      { productId: 1, quantity: 2, price: 100 },
      { productId: 2, quantity: 3, price: 50 },
    ]);
  });

  it('should throw NotFoundError if a product is not found', () => {
    const productTransaction: ProductTransaction[] = [{ productId: 3, quantity: 1 }];

    expect(() => handler['processProductsForOrder'](productTransaction, products)).toThrow(
      new NotFoundError('Product with ID 3 not found'),
    );
  });

  it('should throw StockError if a product has insufficient stock', () => {
    const productTransaction: ProductTransaction[] = [{ productId: 1, quantity: 11 }];

    expect(() => handler['processProductsForOrder'](productTransaction, products)).toThrow(new StockError(1));
  });

  it('should handle an empty product list gracefully', () => {
    const productTransaction: ProductTransaction[] = [];
    const result = handler['processProductsForOrder'](productTransaction, products);

    expect(result.total).toBe(0);
    expect(result.extendedProducts).toEqual([]);
  });
});
