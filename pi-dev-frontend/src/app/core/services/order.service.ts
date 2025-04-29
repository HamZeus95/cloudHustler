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

  prepareCheckout(customerUuid: string): Observable<{ sessionUrl: string }> {
    return this.http.post<{ sessionUrl: string }>(
      `${this.apiUrl}/prepare-checkout/${customerUuid}`,
      {}
    );
  }

  confirmOrderAfterPayment(sessionId: string, customerUuid: string): Observable<Order> {
    return this.http.post<Order>(
      `${this.apiUrl}/confirm?sessionId=${sessionId}&customerUuid=${customerUuid}`,
      {}
    );
  }

  getOrders(customerUuid: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${customerUuid}`);
  }


  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/allOrders`);
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
