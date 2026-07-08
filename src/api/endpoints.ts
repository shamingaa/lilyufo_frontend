import { apiClient } from './client';
import type { AuthUser, Category, Order, OrderStatus, Product } from '../types';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<{ categories: Category[] }>('/categories');
  return data.categories;
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await apiClient.post<{ category: Category }>('/categories', { name });
  return data.category;
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const { data } = await apiClient.put<{ category: Category }>(`/categories/${id}`, { name });
  return data.category;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}

export interface ProductQuery {
  category?: string;
  search?: string;
  page?: number;
}

export async function fetchProducts(
  query: ProductQuery = {}
): Promise<{ products: Product[]; pagination: { page: number; pageSize: number; total: number } }> {
  const { data } = await apiClient.get('/products', { params: query });
  return data;
}

export async function fetchProduct(id: number | string): Promise<Product> {
  const { data } = await apiClient.get<{ product: Product }>(`/products/${id}`);
  return data.product;
}

export interface VariantFormValues {
  size: string;
  price: string;
  stock: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  categoryId: string;
  variants: VariantFormValues[];
  image?: File | null;
}

function toProductFormData(values: ProductFormValues): FormData {
  const formData = new FormData();
  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('variants', JSON.stringify(values.variants));
  if (values.categoryId) formData.append('categoryId', values.categoryId);
  if (values.image) formData.append('image', values.image);
  return formData;
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const { data } = await apiClient.post<{ product: Product }>('/products', toProductFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.product;
}

export async function updateProduct(id: number, values: ProductFormValues): Promise<Product> {
  const { data } = await apiClient.put<{ product: Product }>(
    `/products/${id}`,
    toProductFormData(values),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.product;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function adminLoginRequest(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/admin/login', {
    email,
    password,
  });
  return data;
}

export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function registerRequest(name: string, email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/register', {
    name,
    email,
    password,
  });
  return data;
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}

export interface PlaceOrderPayload {
  items: { variantId: number; quantity: number }[];
  customerName?: string;
  customerPhone: string;
  shippingAddress: string;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<{ order: Order }>('/orders', payload);
  return data.order;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<{ orders: Order[] }>('/orders');
  return data.orders;
}

export async function fetchOrder(id: number | string): Promise<Order> {
  const { data } = await apiClient.get<{ order: Order }>(`/orders/${id}`);
  return data.order;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await apiClient.patch<{ order: Order }>(`/orders/${id}/status`, { status });
  return data.order;
}
