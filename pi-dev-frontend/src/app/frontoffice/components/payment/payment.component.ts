import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from '../../../core/models/market/cart.model';
import { Order } from 'src/app/core/models/market/order.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService, TokenStorageService } from 'src/app/auth/service';
import { loadStripe, Stripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cart: Cart;
  orders: Order[] = [];
  isAuthenticated = false;
  currentUser: any = null;
  sessionId: string | null = null; // <-- store sessionId

  constructor(
    private router: Router,
    private route: ActivatedRoute, // <-- inject ActivatedRoute
    private orderService: OrderService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.cart = navigation?.extras.state?.['cart'];
  }

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    // 🛑 IMPORTANT: Get sessionId from URL
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id'];
      console.log('Received sessionId from Stripe:', this.sessionId);

      if (this.sessionId && this.currentUser) {
        this.confirmOrder();
      }
    });

    this.loadOrders();
  }

  loadOrders() {
    const customerUuid = this.currentUser.userUUID; 
    this.orderService.getOrders(customerUuid).subscribe({
      next: (data) => { 
        console.log("Order data from backend ", data);
        this.orders = data;
      },
      error: (err) => console.error('Failed to fetch orders', err)
    });
  }

  // ⚡️ Confirm the order after payment
  confirmOrder() {
    const customerUuid = this.currentUser.userUUID;
    if (!this.sessionId) {
      console.error('Session ID is missing.');
      return;
    }

    this.orderService.confirmOrderAfterPayment(this.sessionId, customerUuid).subscribe({
      next: (order) => {
        console.log('Order confirmed:', order);
        alert('Payment successful and order confirmed!');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to confirm order', err);
        alert('Failed to confirm the order. Please contact support.');
      }
    });
  }
}