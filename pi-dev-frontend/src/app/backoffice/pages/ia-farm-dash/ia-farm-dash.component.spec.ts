import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaFarmDashComponent } from './ia-farm-dash.component';

describe('IaFarmDashComponent', () => {
  let component: IaFarmDashComponent;
  let fixture: ComponentFixture<IaFarmDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IaFarmDashComponent]
    });
    fixture = TestBed.createComponent(IaFarmDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
