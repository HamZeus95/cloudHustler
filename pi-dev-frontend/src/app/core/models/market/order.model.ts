import { OrderItem } from './order-item';

export interface Order {
  uuid_order: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  consumer: Consumer;
}
export interface Consumer {
  uuid_consumer: string;
  firstName: string;
  lastName: string;
}
