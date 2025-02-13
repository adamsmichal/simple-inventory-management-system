import { BadRequestError } from 'src/errors/bad-request.error';

export class StockError extends BadRequestError {
  constructor(productId: number) {
    super(`Insufficient stock for product ID ${productId}`);
    this.name = 'InsufficientStockError';
  }
}
