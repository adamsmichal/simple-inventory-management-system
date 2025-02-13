import { CreateProductHandler } from './create-product.handler';
import { CreateProductCommand } from '../commands/create-product.command';
import { createProduct } from '../repository/product.repository';
import { Product } from '../models/product.models';

jest.mock('../repository/product.repository', () => ({
  createProduct: jest.fn(),
}));

const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;

const mockedProduct: Product = {
  id: 1,
  name: 'Product 1',
  description: 'Description 1',
  price: 100,
  stock: 10,
  createdAt: new Date('2025-01-27T17:46:46.174Z'),
  updatedAt: new Date('2025-01-27T17:46:46.174Z'),
};

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;

  beforeEach(() => {
    handler = new CreateProductHandler();
    jest.clearAllMocks();
  });

  it('should create a product successfully', async () => {
    const command = new CreateProductCommand({
      name: 'Product A',
      description: 'Description A',
      price: 100,
      stock: 10,
    });

    mockCreateProduct.mockResolvedValue(mockedProduct);

    const result = await handler.execute(command);

    expect(mockCreateProduct).toHaveBeenCalledWith({
      name: 'Product A',
      description: 'Description A',
      price: 100,
      stock: 10,
    });
    expect(result).toEqual(mockedProduct);
  });
});
