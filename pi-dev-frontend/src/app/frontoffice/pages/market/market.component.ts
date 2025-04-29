import { Component } from '@angular/core';
import { Product, ProductCategory } from '../../../core/models/market/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../../core/models/market/cart.model';
import { Order } from '../../../core/models/market/order.model';
import { OrderService } from '../../../core/services/order.service';
import { ProductCategoryService } from 'src/app/core/services/productCategory.service';
import { AuthService } from '../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../auth/service/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent {
  products: Product[] = [];
  categories: ProductCategory[] = [];
  isLoading = true;
  categoryLoading = true;
  orders: Order[] = [];
  cart: Cart = {
    uuid_cart: '',
    cartItems: [],
    totalPrice: 0
  };
  currentPage = 1;
  itemsPerPage = 6;
  totalProducts = 0;
  selectedCategory: string | null = null;
  isCartOpen = false;
  sortOption: string = '';
priceFilter: { min: number; max: number } | null = null;
isAuthenticated = false;
currentUser: any = null;
searchTerm: string = '';
filteredProducts: Product[] = [];

 

  constructor(
    private productService: ProductService, private cartService: CartService,private orderService: OrderService,private categoryService: ProductCategoryService
  ,private authService: AuthService,
  private tokenStorageService: TokenStorageService,
  private router: Router,) { }

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
    this.loadProducts();
    this.loadCategories();
    this.loadCart();
    this.loadOrders();
  }
/*load_products_1.0
  loadProducts(categoryId?: string): void {
    this.isLoading = true;
    
    const productObservable = categoryId 
      ? this.productService.getProductsByCategory(categoryId)
      : this.productService.getAllProducts();

    productObservable.subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = data.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      }
    });
  }**/

//LOAD_PRODUCTS2.0
/*
    loadProducts(categoryId?: string): void {
      this.isLoading = true;
    
      const productObservable = categoryId
        ? this.productService.getProductsByCategory(categoryId)
        : this.productService.getAllProducts();
    
      productObservable.subscribe({
        next: (data) => {
          let filtered = data;
    
          if (this.priceFilter) {
            filtered = filtered.filter(p => p.price >= this.priceFilter!.min && p.price <= this.priceFilter!.max);
          }
    
          this.products = filtered;
          this.sortProducts();
          this.totalProducts = filtered.length;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.isLoading = false;
        }
      });
    }
*/

loadProducts(categoryId?: string): void {
  this.isLoading = true;

  const productObservable = categoryId
    ? this.productService.getProductsByCategory(categoryId)
    : this.productService.getAllProducts();

  productObservable.subscribe({
    next: (data) => {
      let filtered = data;

      if (this.priceFilter) {
        filtered = filtered.filter(p => p.price >= this.priceFilter!.min && p.price <= this.priceFilter!.max);
      }

      // Update products list
      this.products = filtered;
      this.sortProducts();

      // 🔥 Apply search after loading and sorting
      this.applySearchFilter();

      this.totalProducts = this.filteredProducts.length;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error fetching products:', err);
      this.isLoading = false;
    }
  });
}

applySearchFilter(): void {
  if (!this.searchTerm) {
    this.filteredProducts = this.products;
  } else {
    const lowerSearch = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(lowerSearch) ||
      (product.description && product.description.toLowerCase().includes(lowerSearch))
    );
  }
}



  sortProducts(): void {
    switch (this.sortOption) {
      case 'new-arrivals':
        this.products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'az':
        this.products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        this.products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low-high':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        this.products.sort((a, b) => b.price - a.price);
        break;
    }
  }

  filterByPrice(min: number, max: number): void {
    this.priceFilter = { min, max };
    this.loadProducts();
  }
  
  
  addToCart(productId: string) {
    const customerUuid = this.currentUser.userUUID; 
    this.cartService.addToCart(customerUuid, productId, 1).subscribe({
      next: () => {
        this.loadCart();
        
      },
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
    const customerUuid = this.currentUser.userUUID; 
    this.cartService.getCart(customerUuid).subscribe({
      
      next: (data) => {
        console.log('Cart data from backend:', data);
        this.cart = data;
      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }
  removeFromCart(productId: string) {
    const customerUuid = this.currentUser.userUUID; 
    this.cartService.removeFromCart(customerUuid, productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to remove product', err)
    });
  }

  clearCart() {
    const customerUuid = this.currentUser.userUUID; 
    this.cartService.clearCart(customerUuid).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to clear cart', err)
    });
  }

  loadOrders() {
    const customerUuid = this.currentUser.userUUID; 
    this.orderService.getOrders(customerUuid).subscribe({
      next: (data) =>{ 
        console.log("Order data from backend ", data);
        this.orders = data;},
      error: (err) => console.error('Failed to fetch orders', err)
    });
  }


  


  
  checkout() {
    const customerUuid = this.currentUser.userUUID; 
    this.orderService.prepareCheckout(customerUuid).subscribe({
      next: (response) => {
        console.log('Stripe Checkout URL:', response.sessionUrl);
        alert(`Redirecting to Stripe: ${response.sessionUrl}`);
        
        // 👉 OPTIONAL: If you want to automatically redirect the user to Stripe checkout
        window.location.href = response.sessionUrl;
  
        // If you don't want to redirect automatically, you can just show the URL
         this.loadOrders(); 
         this.loadCart();
      },
      error: (err) => console.error('Checkout failed', err)
    });
  }

  loadCategories(): void {
    this.categoryLoading = true;
    this.categoryService.getAllProductCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoryLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.categoryLoading = false;
      }
    });
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategory = categoryId;
    this.loadProducts(categoryId || undefined);
  }

  getProductCountByCategory(categoryId: string): number {
    if (!this.selectedCategory || this.selectedCategory === categoryId) {
      return this.products.filter(p => p.productCategory?.uuid_category === categoryId).length;
    }
    return 0;
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }
  

  // Change page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
  
  onSearchChange(): void {
    this.applySearchFilter();
    this.currentPage = 1; // Reset to first page after search
  }
  

  // Generate page numbers
  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }


  get cartItemsCount(): number {
    if (!this.cart?.cartItems) return 0;
    return this.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  toggleCartPanel(): void {
    this.isCartOpen = !this.isCartOpen;
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
  
}
