import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmTableComponent } from './farm-table.component';

describe('FarmTableComponent', () => {
  let component: FarmTableComponent;
  let fixture: ComponentFixture<FarmTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmTableComponent]
    });
    fixture = TestBed.createComponent(FarmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
