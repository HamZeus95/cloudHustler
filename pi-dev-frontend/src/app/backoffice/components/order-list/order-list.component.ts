import { Component, OnInit } from '@angular/core';
import { AuthService, TokenStorageService } from 'src/app/auth/service';
import { Order } from 'src/app/core/models/market/order.model';

import { OrderService } from 'src/app/core/services/order.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  viewMode: 'list' | 'grid' = 'list'; // Default to list view for orders
  selectedOrder: Order | null = null;
  isAuthenticated = false;
currentUser: any = null;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
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
    this.loadOrders();
  }

  loadOrders(): void {
    const customerUuid = this.currentUser.userUUID; 
    this.isLoading = true;
    this.orderService.getOrders(customerUuid).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      }
    });
  }

  getFullImageUrl(filename: string): string {
    if (!filename) return 'assets/img/placeholder-product.png';
    
    // If it's already a full URL or data URI
    if (filename.startsWith('http') || filename.startsWith('data:')) {
      return filename;
    }
    
    // For images stored in your backend
    return `http://localhost:8090/api/v1${filename}`;
  }

  viewOrderDetails(order: Order): void {
    if (!order?.uuid_order) {
      console.error('Order ID is missing');
      return;
    }
    
    this.orderService.getOrderById(order.uuid_order).subscribe({
      next: (fullOrder) => {
        this.selectedOrder = fullOrder;
      },
      error: (err) => {
        console.error('Error loading order details', err);
      }
    });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  confirmOrder(orderId: string | undefined): void {
    if (!orderId) {
      console.error('Order ID is missing');
      return;
    }

    if (confirm('Are you sure you want to confirm this order?')) {
      this.orderService.confirmOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
          if (this.selectedOrder?.uuid_order === orderId) {
            this.selectedOrder.status = 'SUCCEEDED';
          }
        },
        error: (err) => {
          console.error('Error confirming order', err);
        }
      });
    }
  }

  rejectOrder(orderId: string | undefined): void {
    if (!orderId) {
      console.error('Order ID is missing');
      return;
    }

    if (confirm('Are you sure you want to reject this order?')) {
      this.orderService.rejectOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
          if (this.selectedOrder?.uuid_order === orderId) {
            this.selectedOrder.status = 'CANCELLED';
          }
        },
        error: (err) => {
          console.error('Error rejecting order', err);
        }
      });
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-warning';
      case 'SUCCEEDED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-danger';
      case 'SHIPPED':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
  canManageOrder(status: string | undefined): boolean {
    return status?.toUpperCase() === 'PENDING';
  }

  calculateTotalItems(order: Order): number {
    return order.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  
}