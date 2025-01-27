import { Order as dbOrder, Product } from '@prisma/client';
import { PayloadProduct } from '../../product/models/product.models';

export interface Order extends dbOrder {}

export interface CreateOrderDbTransactionPayload {
  customerId: string;
  products: Product[];
  payloadProducts: PayloadProduct[];
}

export interface CreateOrderDbPayload {
  customerId: string;
  total: number;
  extendedProducts: ExtendedProduct[];
}

export interface ExtendedProduct {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  customerId: string;
  products: PayloadProduct[];
}
