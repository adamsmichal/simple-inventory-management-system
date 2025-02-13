import { Order as DbOrder, Product } from '@prisma/client';
import { ExtendedProduct, ProcessedProductResult, ProductTransaction } from '../../product/models/product.models';

export type Order = DbOrder;

export interface CreateOrderPayload {
  customerId: string;
  products: ProductTransaction[];
}

export interface CreateOrderDbTransactionPayload {
  customerId: string;
  rawProducts: Product[];
  processedProducts: ProductTransaction[];
  processProductsCallback: (processedProducts: ProductTransaction[], rawProducts: Product[]) => ProcessedProductResult;
}

export interface CreateOrderDbPayload {
  customerId: string;
  total: number;
  extendedProducts: ExtendedProduct[];
}
