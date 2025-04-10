import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Cart } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart = {
    uuid_cart: '',
    cartItems: []
  };
  
  customerUuid = '7421256b-be17-455a-8c89-8b382ba0a28a'; // Replace with logic to retrieve actual user

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
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
}
