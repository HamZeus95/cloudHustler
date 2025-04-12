import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Farm } from 'src/app/core/models/famrs/farm';
import { CropService } from 'src/app/core/services/crop.service';
import { Crop } from 'src/app/core/models/famrs/crop';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  @Input() farm!: Farm;
  addCropForm!: FormGroup;
  isAddCropFormVisible = false;

  constructor(private fb: FormBuilder, private cropService: CropService) {}

  ngOnInit(): void {
    this.addCropForm = this.fb.group({
      name: ['', Validators.required],
      plantingDate: [null, Validators.required],
      harvestDate: [null, Validators.required],
      expectedYield: [null, [Validators.required, Validators.min(0)]]
    });
  }

  toggleAddCropForm(): void {
    this.isAddCropFormVisible = !this.isAddCropFormVisible;
  }

  onAddCrop(): void {
    if (this.addCropForm.valid) {
      const newCrop: Crop = {
        name: this.addCropForm.value.name,
        plantingDate: this.addCropForm.value.plantingDate,
        harvestDate: this.addCropForm.value.harvestDate,
        expectedYield: this.addCropForm.value.expectedYield,
        farm_id: this.farm.uuid_farm, // Make sure farm_id is included
      };

      this.cropService.addCrop(newCrop, this.farm.uuid_farm).subscribe((crop: Crop) => {
        this.farm.crops.push(crop);
        this.isAddCropFormVisible = false; // Hide the form after adding crop
        this.addCropForm.reset(); // Reset the form
      });
    }
  }

  onDeleteCrop(cropId: string): void {
    this.cropService.deleteCrop(cropId).subscribe(() => {
      this.farm.crops = this.farm.crops.filter(crop => crop.uuid_crop !== cropId);
    });
  }

  getCropStatus(crop: Crop): string {
    const currentDate = new Date();
    const plantingDate = crop.plantingDate ? new Date(crop.plantingDate) : new Date();
    const harvestDate = new Date(crop.harvestDate ?? new Date());

    // Determine the status based on the crop's dates
    if (currentDate < plantingDate) {
      return 'Pending';
    } else if (currentDate > harvestDate) {
      return 'Harvested';
    } else {
      return 'In Progress';
    }
  }
}
