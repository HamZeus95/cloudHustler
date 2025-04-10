import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8090/pi/orders';

  constructor(private http: HttpClient) {}

  checkout(customerUuid: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${customerUuid}/checkout`, {});
  }

  getOrders(customerUuid: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${customerUuid}`);
  }

  getOrderById(orderUuid: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/order/${orderUuid}`);
  }
}
