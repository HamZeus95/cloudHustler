import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefactureComponent } from './createfacture.component';

describe('CreatefactureComponent', () => {
  let component: CreatefactureComponent;
  let fixture: ComponentFixture<CreatefactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatefactureComponent]
    });
    fixture = TestBed.createComponent(CreatefactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
