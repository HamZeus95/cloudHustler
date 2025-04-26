import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategorieslistComponent } from './product-categorieslist.component';

describe('ProductCategorieslistComponent', () => {
  let component: ProductCategorieslistComponent;
  let fixture: ComponentFixture<ProductCategorieslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCategorieslistComponent]
    });
    fixture = TestBed.createComponent(ProductCategorieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
