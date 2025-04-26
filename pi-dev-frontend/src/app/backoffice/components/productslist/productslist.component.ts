import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCategory } from 'src/app/core/models/market/product';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductCategoryService } from 'src/app/core/services/productCategory.service';

@Component({
  selector: 'app-productslist',
  templateUrl: './productslist.component.html',
  styleUrls: ['./productslist.component.css']
})
export class ProductslistComponent {
  products: Product[] = [];
  productForm: FormGroup;
  isAdding = false;
  isEditing = false;
  currentProductId: string | null = null;
  isLoading = true;
  categories: ProductCategory[] = [];
  discountInput: { [id: string]: number } = {};
  viewMode: 'grid' | 'list' = 'list';// Default view mode

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, Validators.min(0)],
      isAvailable: [false],
      imageUrl: [''],
      productCategory: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  startAdd(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      isAvailable: false,
      imageUrl: '',
      productCategory: ''
    });
  }

  startEdit(product: Product): void {
    this.isAdding = false;
    this.isEditing = true;
    this.currentProductId = product.uuid_product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      isAvailable: product.isAvailable,
      imageUrl: product.imageUrl,
      productCategory: product.productCategory?.uuid_category || ''
    });
  }

  cancel(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.currentProductId = null;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    const formValue = this.productForm.value;
    const productData: Product = {
      uuid_product: this.currentProductId || '',
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      quantity: formValue.quantity,
      isAvailable: formValue.isAvailable,
      imageUrl: formValue.imageUrl,
      createdAt: new Date(),
      productCategory: this.categories.find(c => c.uuid_category === formValue.productCategory),
      farmer: undefined
    };

    const operation = this.isEditing 
      ? this.productService.updateProduct(productData)
      : this.productService.createProduct(productData, formValue.productCategory);

    operation.subscribe({
      next: (savedProduct) => {
        if (this.isEditing) {
          const index = this.products.findIndex(p => p.uuid_product === savedProduct.uuid_product);
          if (index !== -1) {
            this.products[index] = savedProduct;
          }
        } else {
          this.products.push(savedProduct);
        }
        this.cancel();
        this.loadProducts(); // Refresh the list
      },
      error: (err) => {
        console.error('Error saving product', err);
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.uuid_product !== productId);
        },
        error: (err) => {
          console.error('Error deleting product', err);
        }
      });
    }
  }

  applyDiscount(productId: string, discount: number) {
    this.productService.applyDiscount(productId, discount).subscribe({
      next: () => this.loadProducts(), // Refresh product list after applying
      error: (err) => console.error(err)
    });
  }
  

  removeDiscount(productId: string) {
    this.productService.removeDiscount(productId).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err)
    });
  }
  
}
