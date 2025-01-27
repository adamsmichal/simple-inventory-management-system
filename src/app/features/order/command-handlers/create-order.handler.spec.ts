import { CreateOrderHandler, processProductsForOrder } from './create-order.handler';
import { CreateOrderCommand } from '../commands/create-order.command';
import { createOrderTransaction } from '../repository/order.repository';

import { findProductsByIds } from 'src/app/features/product/repository/product.repository';
import { StockError } from 'src/app/features/product/errors/stock.error';
import { NotFoundError } from 'src/errors/not-found.error';
import { PayloadProduct, Product } from '../../product/models/product.models';
import { ExtendedProduct } from '../model/order.model';

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
  createdAt: new Date('2025-01-27T17:46:46.174Z'),
  updatedAt: new Date('2025-01-27T17:46:46.174Z'),
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
    mockCreateOrderTransaction.mockResolvedValue({ id: 'order-1', total: 200 } as any);

    const result = await handler.execute(command);

    expect(mockFindProductsByIds).toHaveBeenCalledWith([1]);
    expect(mockCreateOrderTransaction).toHaveBeenCalledWith({
      customerId: '123',
      payloadProducts: [{ productId: 1, quantity: 2 }],
      products: [mockedProduct],
    });
    expect(result).toEqual({ id: 'order-1', total: 200 });
  });

  it('should throw StockError when stock is insufficient', async () => {
    const command = new CreateOrderCommand({
      customerId: '123',
      products: [{ productId: 1, quantity: 2 }],
    });

    mockFindProductsByIds.mockResolvedValue([mockedProduct]);

    mockCreateOrderTransaction.mockImplementation(() => {
      throw new StockError(1);
    });

    await expect(handler.execute(command)).rejects.toThrow(StockError);
  });

  it('should throw NotFoundError when product is not found', async () => {
    const command = new CreateOrderCommand({
      customerId: '123',
      products: [{ productId: 1, quantity: 2 }],
    });

    mockFindProductsByIds.mockResolvedValue([]);

    mockCreateOrderTransaction.mockImplementation(() => {
      throw new NotFoundError('Product with ID 1 not found');
    });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundError);
  });
});

describe('processProductsForOrder', () => {
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
    const payloadProducts: PayloadProduct[] = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ];

    const result = processProductsForOrder(payloadProducts, products);

    expect(result.total).toBe(350);
    expect(result.extendedProducts).toEqual<ExtendedProduct[]>([
      { productId: 1, quantity: 2, price: 100 },
      { productId: 2, quantity: 3, price: 50 },
    ]);
  });

  it('should throw NotFoundError if a product is not found', () => {
    const payloadProducts: PayloadProduct[] = [{ productId: 3, quantity: 1 }];

    expect(() => processProductsForOrder(payloadProducts, products)).toThrow(
      new NotFoundError('Product with ID 3 not found'),
    );
  });

  it('should throw StockError if a product has insufficient stock', () => {
    const payloadProducts: PayloadProduct[] = [{ productId: 1, quantity: 11 }];

    expect(() => processProductsForOrder(payloadProducts, products)).toThrow(new StockError(1));
  });

  it('should handle an empty product list gracefully', () => {
    const payloadProducts: PayloadProduct[] = [];
    const result = processProductsForOrder(payloadProducts, products);

    expect(result.total).toBe(0);
    expect(result.extendedProducts).toEqual([]);
  });
});
