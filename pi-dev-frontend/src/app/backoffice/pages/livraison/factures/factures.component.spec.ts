import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureComponent } from './factures.component';

describe('FacturesComponent', () => {
  let component: FactureComponent;
  let fixture: ComponentFixture<FactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactureComponent]
    });
    fixture = TestBed.createComponent(FactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
