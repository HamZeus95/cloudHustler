import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropDiseaseDetectorComponent } from './crop-disease-detector.component';

describe('CropDiseaseDetectorComponent', () => {
  let component: CropDiseaseDetectorComponent;
  let fixture: ComponentFixture<CropDiseaseDetectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CropDiseaseDetectorComponent]
    });
    fixture = TestBed.createComponent(CropDiseaseDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
