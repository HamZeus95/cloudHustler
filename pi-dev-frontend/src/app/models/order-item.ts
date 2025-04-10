import { Product } from '../product';

export interface OrderItem {
  uuid_orderItem: string;
  product: Product;
  quantity: number;
}
