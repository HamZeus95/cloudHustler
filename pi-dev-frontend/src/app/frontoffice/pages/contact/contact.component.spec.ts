import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:pi-dev-frontend/src/app/frontoffice/components/navbar/navbar.component.spec.ts
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent]
    });
    fixture = TestBed.createComponent(NavbarComponent);
========
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarComponent]
    });
    fixture = TestBed.createComponent(SideBarComponent);
>>>>>>>> origin/Resource:pi-dev-frontend/src/app/frontoffice/pages/contact/contact.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
