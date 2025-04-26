import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCategory } from 'src/app/core/models/market/product';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductCategoryService } from 'src/app/core/services/productCategory.service';

@Component({
  selector: 'app-marketplace-management',
  templateUrl: './marketplace-management.component.html',
  styleUrls: ['./marketplace-management.component.css']
})
export class MarketplaceManagementComponent {
  
}