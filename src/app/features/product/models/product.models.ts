import { Product as DbProduct } from '@prisma/client';

export type Product = DbProduct;

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface GetProductsParams {}

export interface RestockProductPayload {
  productId: number;
}

export interface SellProductPayload {
  productId: number;
}

export interface ProductTransaction {
  productId: number;
  quantity: number;
}

export interface ProcessedProductResult {
  extendedProducts: ExtendedProduct[];
  total: number;
}

export interface ExtendedProduct {
  productId: number;
  quantity: number;
  price: number;
}
