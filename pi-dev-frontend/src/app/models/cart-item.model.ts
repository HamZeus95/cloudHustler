import { Product } from '../product';

export interface CartItem {
  uuid_cartItem: string;
  product: Product;
  quantity: number;
}
