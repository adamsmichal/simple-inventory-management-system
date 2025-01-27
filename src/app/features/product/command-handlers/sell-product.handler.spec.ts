import { SellProductHandler } from './sell-product.handler';
import { SellProductCommand } from '../commands/sell-product.command';
import { getProductById, sellProduct } from '../repository/product.repository';
import { NotFoundError } from 'src/errors/not-found.error';
import { StockError } from '../errors/stock.error';
import { Product } from '../models/product.models';

jest.mock('../repository/product.repository', () => ({
  getProductById: jest.fn(),
  sellProduct: jest.fn(),
}));

const mockGetProductById = getProductById as jest.MockedFunction<typeof getProductById>;
const mockSellProduct = sellProduct as jest.MockedFunction<typeof sellProduct>;

const mockedProduct: Product = {
  id: 1,
  name: 'Product 1',
  description: 'Description 1',
  price: 100,
  stock: 10,
  createdAt: new Date('2025-01-27T17:46:46.174Z'),
  updatedAt: new Date('2025-01-27T17:46:46.174Z'),
};

describe('SellProductHandler', () => {
  let handler: SellProductHandler;

  beforeEach(() => {
    handler = new SellProductHandler();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should successfully sell a product', async () => {
    const command = new SellProductCommand({ id: 1 });

    mockGetProductById.mockResolvedValue(mockedProduct);
    mockSellProduct.mockResolvedValue({
      ...mockedProduct,
      stock: mockedProduct.stock - 1,
    });

    const result = await handler.execute(command);

    expect(mockGetProductById).toHaveBeenCalledWith(1);
    expect(mockSellProduct).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      ...mockedProduct,
      stock: mockedProduct.stock - 1,
    });
  });

  it('should throw NotFoundError if the product is not found', async () => {
    const command = new SellProductCommand({ id: 999 });

    mockGetProductById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundError);

    expect(mockGetProductById).toHaveBeenCalledWith(999);
    expect(mockSellProduct).not.toHaveBeenCalled();
  });

  it('should throw StockError if the product stock is 0', async () => {
    const command = new SellProductCommand({ id: 1 });

    mockGetProductById.mockResolvedValue({
      ...mockedProduct,
      stock: 0,
    });

    await expect(handler.execute(command)).rejects.toThrow(StockError);

    expect(mockGetProductById).toHaveBeenCalledWith(1);
    expect(mockSellProduct).not.toHaveBeenCalled();
  });

  it('should throw StockError if the product stock is negative', async () => {
    const command = new SellProductCommand({ id: 1 });

    mockGetProductById.mockResolvedValue({
      ...mockedProduct,
      stock: -1,
    });

    await expect(handler.execute(command)).rejects.toThrow(StockError);

    expect(mockGetProductById).toHaveBeenCalledWith(1);
    expect(mockSellProduct).not.toHaveBeenCalled();
  });
});
