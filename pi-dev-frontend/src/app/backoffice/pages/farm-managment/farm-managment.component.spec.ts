import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmManagmentComponent } from './farm-managment.component';

describe('FarmManagmentComponent', () => {
  let component: FarmManagmentComponent;
  let fixture: ComponentFixture<FarmManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmManagmentComponent]
    });
    fixture = TestBed.createComponent(FarmManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
