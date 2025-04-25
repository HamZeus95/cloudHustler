import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:pi-dev-frontend/src/app/frontoffice/pages/event/event.component.spec.ts
import { EventComponent } from './event.component';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventComponent]
    });
    fixture = TestBed.createComponent(EventComponent);
========
import { FarmTableComponent } from './farm-table.component';

describe('FarmTableComponent', () => {
  let component: FarmTableComponent;
  let fixture: ComponentFixture<FarmTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmTableComponent]
    });
    fixture = TestBed.createComponent(FarmTableComponent);
>>>>>>>> origin/Resource:pi-dev-frontend/src/app/backoffice/components/farm-table/farm-table.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
