import { Component } from '@angular/core';
import { Product } from '../core/models/market/product';
import { ProductService } from '../core/services/product.service';
import { CartService } from '../core/services/cart.service';
import { Cart } from '../core/models/market/cart.model';
import { Order } from '../core/models/market/order.model';
import { OrderService } from '../core/services/order.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent {
  products: Product[] = [];
  isLoading = true;
  orders: Order[] = [];
  cart: Cart = {
    uuid_cart: '',
    cartItems: [],
    totalPrice: 0
  };
  
  customerUuid = '7421256b-be17-455a-8c89-8b382ba0a28a'; // Replace with logic to retrieve actual user

  constructor(private productService: ProductService, private cartService: CartService,private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCart();
    this.loadOrders();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      }
    });
  }
  addToCart(productId: string) {
    this.cartService.addToCart(this.customerUuid, productId, 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Add to cart failed', err)
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.uuid_product !== id);
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }
  loadCart() {
    this.cartService.getCart(this.customerUuid).subscribe({
      
      next: (data) => {
        console.log('Cart data from backend:', data);
        this.cart = data;
      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }
  removeFromCart(productId: string) {
    this.cartService.removeFromCart(this.customerUuid, productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to remove product', err)
    });
  }

  clearCart() {
    this.cartService.clearCart(this.customerUuid).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to clear cart', err)
    });
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
        this.loadOrders(); 
        this.loadCart();// Refresh orders list
      },
      error: (err) => console.error('Checkout failed', err)
    });
    
  }
  
}
