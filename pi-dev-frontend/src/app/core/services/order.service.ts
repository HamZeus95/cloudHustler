import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/market/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = '/api/v1/orders';

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

  confirmOrder(orderUuid: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/confirm/${orderUuid}`, {});
  }

  rejectOrder(orderUuid: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/cancel/${orderUuid}`, {});
  }
}
