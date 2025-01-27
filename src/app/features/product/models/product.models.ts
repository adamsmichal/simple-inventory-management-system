import { Product as DbProduct } from '@prisma/client';

export interface Product extends DbProduct {}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface GetProductsParams {}

export interface RestockProductPayload {
  id: number;
}

export interface SellProductPayload extends RestockProductPayload {}

export interface PayloadProduct {
  productId: number;
  quantity: number;
}
