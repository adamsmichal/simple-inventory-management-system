import { RestockProductHandler } from './restock-product.handler';
import { RestockProductCommand } from '../commands/restock-product.command';
import { restockProduct } from '../repository/product.repository';
import { Product } from '../models/product.models';

jest.mock('../repository/product.repository', () => ({
  restockProduct: jest.fn(),
}));

const mockRestockProduct = restockProduct as jest.MockedFunction<typeof restockProduct>;

const mockedProduct: Product = {
  id: 1,
  name: 'Product 1',
  description: 'Description 1',
  price: 100,
  stock: 10,
  createdAt: new Date('2025-01-27T17:46:46.174Z'),
  updatedAt: new Date('2025-01-27T17:46:46.174Z'),
};

describe('RestockProductHandler', () => {
  let handler: RestockProductHandler;

  beforeEach(() => {
    handler = new RestockProductHandler();
    jest.clearAllMocks();
  });

  it('should restock a product successfully', async () => {
    const command = new RestockProductCommand({ id: 1 });

    mockRestockProduct.mockResolvedValue(mockedProduct);

    const result = await handler.execute(command);

    expect(mockRestockProduct).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockedProduct);
  });
});
