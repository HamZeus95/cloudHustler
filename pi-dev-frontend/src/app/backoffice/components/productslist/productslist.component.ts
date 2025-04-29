import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCategory } from 'src/app/core/models/market/product';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductCategoryService } from 'src/app/core/services/productCategory.service';
import { AiService } from 'src/app/core//services/ai.service';
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
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isUploading = false;
  isUsingAI = false;

  constructor(
    private productService: ProductService,
    private aiService: AiService,
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
    this.isUsingAI = false;
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
/*
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
  }*/

    onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          alert('Only JPEG, PNG, and GIF images are allowed');
          return;
        }
  
        // Validate file size (10MB max - matches your backend config)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size exceeds 10MB limit');
          return;
        }
  
        this.selectedFile = file;
  
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      }
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
  
    saveProduct(): void {
      if (this.productForm.invalid) {
        alert('Please fill all required fields correctly');
        return;
      }
  
      this.isUploading = true;
      const formValue = this.productForm.value;
      const productData: Product = {
        uuid_product: this.currentProductId || '',
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        quantity: formValue.quantity,
        isAvailable: formValue.isAvailable,
        imageUrl: '',
        createdAt: new Date(),
        productCategory: this.categories.find(c => c.uuid_category === formValue.productCategory),
        farmer: undefined
      };
  
      const operation = this.isEditing
        ? this.productService.updateProductWithImage(
            this.currentProductId!,
            productData,
            this.selectedFile
          )
        : this.productService.createProductWithImage(
            productData,
            this.selectedFile,
            formValue.productCategory
          );
  
      operation.subscribe({
        next: (savedProduct) => {
          this.isUploading = false;
          if (this.isEditing) {
            const index = this.products.findIndex(p => p.uuid_product === savedProduct.uuid_product);
            if (index !== -1) {
              this.products[index] = savedProduct;
            }
          } else {
            this.products.push(savedProduct);
          }
          this.resetForm();
        },
        error: (err) => {
          this.isUploading = false;
          console.error('Error saving product', err);
          alert('Error saving product. Please try again.');
        }
      });
    }
  
    private resetForm(): void {
      this.selectedFile = null;
      this.previewUrl = null;
      this.isAdding = false;
      this.isEditing = false;
      this.currentProductId = null;
      this.productForm.reset();
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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

  startAddWithAI() {
    this.isAdding = true;
    this.isEditing = false;
    this.productForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.isUsingAI = true; // <--- New flag to detect AI mode
  }

  onFileSelectedForAI(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and GIF images are allowed');
        return;
      }
  
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
      }
  
      this.selectedFile = file;
  
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
  
        // 📢 Once preview is ready, call the AI service
        this.aiService.analyzeImage(this.selectedFile!).subscribe({
          next: (response: any) => {
            console.log('AI Response:', response);
  
            // Fill your form with AI response
            this.productForm.patchValue({
              name: response.product_name,
              description: response.description,
              price: parseFloat(response.price),
              quantity: parseInt(response.quantity)
            });
          },
          error: (error) => {
            console.error('AI Error:', error);
            alert('Error analyzing image with AI service.');
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }
  


  
}
