import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCategory } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private apiUrl = 'http://localhost:8090/pi/productcategory'; // Changed to match backend base path

  constructor(private http: HttpClient) { }

  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/retrieveAllProductCategories`);
  }

  getProductCategoryById(idProductCategory: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`${this.apiUrl}/retrieveProductCategory/${idProductCategory}`);
  }

  createProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(`${this.apiUrl}/addProductCategory`, productCategory);
  }

  updateProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.http.put<ProductCategory>(`${this.apiUrl}/updateProductCategory`, productCategory);
  }

  deleteProductCategory(idProductCategory: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteProduct/${idProductCategory}`);
  }
}