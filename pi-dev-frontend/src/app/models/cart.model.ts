import { CartItem } from './cart-item.model';

export interface Cart {
  uuid_cart: string;
  cartItems: CartItem[];
}
