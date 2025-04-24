import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:pi-dev-frontend/src/app/backoffice/components/stats/stats.component.spec.ts
import { StatsComponent } from './stats.component';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsComponent]
    });
    fixture = TestBed.createComponent(StatsComponent);
========
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent]
    });
    fixture = TestBed.createComponent(BannerComponent);
>>>>>>>> origin/Resource:pi-dev-frontend/src/app/backoffice/components/banner/banner.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
