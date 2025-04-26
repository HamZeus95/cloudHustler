import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCategory } from 'src/app/core/models/market/product';
import { ProductCategoryService } from 'src/app/core/services/productCategory.service';

@Component({
  selector: 'app-product-categorieslist',
  templateUrl: './product-categorieslist.component.html',
  styleUrls: ['./product-categorieslist.component.css']
})
export class ProductCategorieslistComponent {
  categories: ProductCategory[] = [];
  categoryForm: FormGroup;
  isAdding = false;
  isEditing = false;
  currentCategoryId: string | null = null;
  isLoading = true;
  viewMode: 'grid' | 'list' = 'list'; // Default view mode

  constructor(
    private categoryService: ProductCategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllProductCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.isLoading = false;
      }
    });
  }

  startAdd(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.currentCategoryId = null;
    this.categoryForm.reset({
      name: '',
      description: ''
    });
  }

  startEdit(category: ProductCategory): void {
    this.isAdding = false;
    this.isEditing = true;
    this.currentCategoryId = category.uuid_category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  cancel(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.currentCategoryId = null;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    const formValue = this.categoryForm.value;
    const categoryData: ProductCategory = {
      uuid_category: this.currentCategoryId || '',
      name: formValue.name,
      description: formValue.description
    };

    const operation = this.isEditing 
      ? this.categoryService.updateProductCategory(categoryData)
      : this.categoryService.createProductCategory(categoryData);

    operation.subscribe({
      next: (savedCategory) => {
        if (this.isEditing) {
          const index = this.categories.findIndex(c => c.uuid_category === savedCategory.uuid_category);
          if (index !== -1) {
            this.categories[index] = savedCategory;
          }
        } else {
          this.categories.push(savedCategory);
        }
        this.cancel();
        this.loadCategories(); // Refresh the list
      },
      error: (err) => {
        console.error('Error saving category', err);
      }
    });
  }

  deleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteProductCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.uuid_category !== categoryId);
        },
        error: (err) => {
          console.error('Error deleting category', err);
        }
      });
    }
  }
}