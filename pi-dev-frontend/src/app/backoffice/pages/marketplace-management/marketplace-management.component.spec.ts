import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceManagementComponent } from './marketplace-management.component';

describe('MarketplaceManagementComponent', () => {
  let component: MarketplaceManagementComponent;
  let fixture: ComponentFixture<MarketplaceManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketplaceManagementComponent]
    });
    fixture = TestBed.createComponent(MarketplaceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
