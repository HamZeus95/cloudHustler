import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/market/product';

export interface ProductSalesDTO {
  productName: string;
  totalQuantitySold: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/v1/product'; // Changed to match backend base path

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/retrieveAllProducts`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/retrieveProduct/${id}`);
  }

  createProduct(product: Product, idProductCategory: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/addProduct/${idProductCategory}`, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/updateProduct`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteProduct/${id}`);
  }

  applyDiscount(id: string, discount: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/applyDiscount/${id}?discount=${discount}`, {});
  }

  removeDiscount(id: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/removeDiscount/${id}`, {});
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/by-category/${categoryId}`);
  }

 // Sorting operations
 getNewestProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/newest`);
}

getProductsByNameAsc(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/name-asc`);
}

getProductsByNameDesc(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/name-desc`);
}

getProductsByPriceAsc(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/price-asc`);
}

getProductsByPriceDesc(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/price-desc`);
}

// Price range operation
getProductsByPriceRange(minPrice?: number, maxPrice?: number): Observable<Product[]> {
  let url = `${this.apiUrl}/price-range`;
  const params = [];
  
  if (minPrice !== undefined) {
    params.push(`minPrice=${minPrice}`);
  }
  if (maxPrice !== undefined) {
    params.push(`maxPrice=${maxPrice}`);
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  return this.http.get<Product[]>(url);
}

getTopSellingProducts(): Observable<ProductSalesDTO[]> {
  return this.http.get<ProductSalesDTO[]>(`${this.apiUrl}/top-sold-products`);
}

}