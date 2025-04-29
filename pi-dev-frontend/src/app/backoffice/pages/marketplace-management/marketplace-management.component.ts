import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductCategoryService } from 'src/app/core/services/productCategory.service';
import { OrderService } from 'src/app/core/services/order.service'; // <-- Add this if you have an OrderService
import { AuthService } from '../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../auth/service/token-storage.service';


@Component({
  selector: 'app-marketplace-management',
  templateUrl: './marketplace-management.component.html',
  styleUrls: ['./marketplace-management.component.css']
})
export class MarketplaceManagementComponent implements OnInit {

  totalProducts: number = 0;
  totalCategories: number = 0;
  totalOrders: number = 0;
  isAuthenticated = false;
currentUser: any = null;

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private orderService: OrderService,
    private authService: AuthService,
  private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
      console.log(this.currentUser)
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadCounts();
  }

  loadCounts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.totalProducts = products.length;
    });

    this.categoryService.getAllProductCategories().subscribe(categories => {
      this.totalCategories = categories.length;
    });

    this.orderService.getAllOrders().subscribe(orders => {
      this.totalOrders = orders.length;
    });
  }
}
