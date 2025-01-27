import { prisma } from 'src/config/db';
import { CreateProductPayload } from '../models/product.models';

export const createProduct = async (data: CreateProductPayload) => {
  const product = await prisma.product.create({ data });
  return product;
};

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const restockProduct = async (id: number) => {
  return prisma.product.update({
    where: { id },
    data: { stock: { increment: 1 } },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const sellProduct = async (id: number) => {
  return prisma.product.update({
    where: { id },
    data: { stock: { decrement: 1 } },
  });
};

export const findProductsByIds = async (ids: number[]) => {
  return prisma.product.findMany({
    where: {
      id: { in: ids },
    },
  });
};

export const updateProductStock = async (id: number, decrementBy: number) => {
  return prisma.product.update({
    where: { id },
    data: { stock: { decrement: decrementBy } },
  });
};
