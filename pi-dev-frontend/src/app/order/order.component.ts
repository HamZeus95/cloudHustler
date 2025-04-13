import { Component, OnInit } from '@angular/core';
import { OrderService } from '../core/services/order.service';
import { Order } from '../core/models/market/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  customerUuid = '7421256b-be17-455a-8c89-8b382ba0a28a'; // Replace with actual logic

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders(this.customerUuid).subscribe({
      next: (data) =>{ 
        console.log("Order data from backend ", data);
        this.orders = data;},
      error: (err) => console.error('Failed to fetch orders', err)
    });
  }

  checkout() {
    this.orderService.checkout(this.customerUuid).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.loadOrders(); // Refresh orders list
      },
      error: (err) => console.error('Checkout failed', err)
    });
  }
}
