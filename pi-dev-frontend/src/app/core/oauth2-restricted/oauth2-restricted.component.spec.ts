import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oauth2RestrictedComponent } from './oauth2-restricted.component';

describe('Oauth2RestrictedComponent', () => {
  let component: Oauth2RestrictedComponent;
  let fixture: ComponentFixture<Oauth2RestrictedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Oauth2RestrictedComponent]
    });
    fixture = TestBed.createComponent(Oauth2RestrictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
