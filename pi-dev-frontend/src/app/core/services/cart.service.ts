import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/market/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:8090/pi/cart'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getCart(customerUuid: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${customerUuid}`);
  }

  addToCart(customerUuid: string, productUuid: string, quantity: number): Observable<void> {
    const params = new HttpParams()
      .set('productUuid', productUuid)
      .set('quantity', quantity);
    return this.http.post<void>(`${this.apiUrl}/${customerUuid}/add`, {}, { params });
  }

  removeFromCart(customerUuid: string, productUuid: string): Observable<void> {
    const params = new HttpParams().set('productUuid', productUuid);
    return this.http.delete<void>(`${this.apiUrl}/${customerUuid}/remove`, { params });
  }

  clearCart(customerUuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerUuid}/clear`);
  }
}
