import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmService } from '../../../core/services/farm.service';

@Component({
  selector: 'app-add-farm',
  templateUrl: './add-farm.component.html',
  styleUrls: ['./add-farm.component.css']
})
export class AddFarmComponent {
  farmForm: FormGroup;
  loading = false;
  irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Pivot', 'None'];

  constructor(
    private fb: FormBuilder,
    private farmService: FarmService,
    private router: Router
  ) {
    this.farmForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      size: ['', [Validators.required, Validators.min(0.1)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      irrigation_type: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.farmForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const newFarm = this.farmForm.value;

    this.farmService.addFarm(newFarm).subscribe({
      next: () => {
        console.log('Farm added successfully');
        this.router.navigate(['/farms']);
      },
      error: (err) => {
        console.error('Error adding farm:', err);
        this.loading = false;
      }
    });
  }

  markAllAsTouched(): void {
    Object.values(this.farmForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/farms']);
  }
}
