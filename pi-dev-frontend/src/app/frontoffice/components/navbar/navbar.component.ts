import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/core/models/market/cart.model';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  dropdownOpen = false;
cart: Cart = {
    uuid_cart: '',
    cartItems: [],
    totalPrice: 0
  };
  
  customerUuid = '7421256b-be17-455a-8c89-8b382ba0a28a'; // Replace with logic to retrieve actual user
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
constructor(private cartService:CartService) { }
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

}
