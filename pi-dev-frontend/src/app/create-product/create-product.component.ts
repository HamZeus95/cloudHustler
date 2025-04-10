// create-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ProductCategoryService } from '../productCategory.service';
import { ProductCategory } from '../product';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;
  isSubmitting = false;
  categories: ProductCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      isAvailable: [true],
      imageUrl: [''],
      idProductCategory: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const productData = this.productForm.value;
      
      this.productService.createProduct(productData, productData.idProductCategory).subscribe({
        next: (product) => {
          this.isSubmitting = false;
          this.router.navigate(['/products', product.uuid_product]);
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}