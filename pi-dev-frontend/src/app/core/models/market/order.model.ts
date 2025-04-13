import { OrderItem } from './order-item';

export interface Order {
  uuid_order: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
}
