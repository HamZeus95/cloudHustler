import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Crop } from 'src/app/core/models/famrs/crop';
import { Expense } from 'src/app/core/models/famrs/expense';
import { CropService } from 'src/app/core/services/crop.service';
import { Farm } from 'src/app/core/models/famrs/farm';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { RessourceService } from 'src/app/core/services/ressource.service';
import { Ressource } from 'src/app/core/models/famrs/resource';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  @Input() farm!: Farm;

  //ia
  useAIAgent: boolean = false;
  isLoadingAIAgent: boolean = false;


  // Crops
  addCropForm!: FormGroup;
  isAddCropFormVisible = false;

  // Resources
  addResourceForm!: FormGroup;
  isAddResourceFormVisible = false;

  // Expenses
  addExpenseForm!: FormGroup;
  isAddExpenseFormVisible = false;

  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private resourceService: RessourceService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    // Crop form
    this.addCropForm = this.fb.group({
      name: ['', Validators.required],
      plantingDate: [null, Validators.required],
      harvestDate: [null, Validators.required],
      expectedYield: [null, [Validators.required, Validators.min(0)]]

    });

    // Resource form
    this.addResourceForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
      cost: [null, [Validators.required, Validators.min(0)]]
    });

    // Expense form
    this.addExpenseForm = this.fb.group({
      expenseType: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      date: [null, Validators.required],
      description: ['']
    });
  }

  // ========== CROPS ==========
  toggleAddCropForm() {
    this.isAddCropFormVisible = !this.isAddCropFormVisible;
  }

  onAddCrop() {
    if (this.addCropForm.valid) {
      const newCrop: Crop = {
        name: this.addCropForm.value.name,
        plantingDate: this.addCropForm.value.plantingDate,
        harvestDate: this.addCropForm.value.harvestDate,
        expectedYield: this.addCropForm.value.expectedYield,
        farm_id: this.farm.uuid_farm,
      };

      this.cropService.addCrop(newCrop, this.farm.uuid_farm).subscribe((crop: Crop) => {
        this.farm.crops.push(crop);
        this.isAddCropFormVisible = false;
        this.addCropForm.reset();
      });
      if (this.useAIAgent) {
        // First add the crop, then trigger AI task generation
        this.triggerAIAgentTaskGeneration(newCrop);        
      } 
    }
  }

  // funto is used to trigger the AI agent task generation
  triggerAIAgentTaskGeneration(crop: Crop): void {
    console.log('Triggering AI Agent task generation for crop:', crop);
    this.isLoadingAIAgent = true; 
    this.cropService.triggerTaskGeneration(crop).subscribe({
      next: (res) => {
        console.log('AI Agent triggered successfully:', res);
        this.isLoadingAIAgent = false; 
      },
      error: (err) => {
        console.error('AI Agent failed:', err);
        this.isLoadingAIAgent = false; 
      }
    });
  }

  onDeleteCrop(cropId: string) {
    this.cropService.deleteCrop(cropId).subscribe(() => {
      this.farm.crops = this.farm.crops.filter(crop => crop.uuid_crop !== cropId);
    });
  }

  getCropStatus(crop: Crop): string {
    const currentDate = new Date();
    const plantingDate = crop.plantingDate ? new Date(crop.plantingDate) : new Date();
    const harvestDate = new Date(crop.harvestDate ?? new Date());

    if (currentDate < plantingDate) return 'Pending';
    else if (currentDate > harvestDate) return 'Harvested';
    else return 'In Progress';
  }

  // ========== RESOURCES ==========
  toggleAddResourceForm() {
    this.isAddResourceFormVisible = !this.isAddResourceFormVisible;
  }

  onAddResource() {
    if (this.addResourceForm.valid) {
      const newRessource: Ressource = {
        name: this.addResourceForm.value.name,
        quantity: this.addResourceForm.value.quantity,
        unit: this.addResourceForm.value.unit,
        cost: this.addResourceForm.value.cost,
        farm_id: this.farm.uuid_farm
      };

      this.resourceService.addRessource(newRessource, this.farm.uuid_farm).subscribe((resource: Ressource) => {
        this.farm.resources.push(resource);
        this.isAddResourceFormVisible = false;
        this.addResourceForm.reset();
      });
    }
  }

  onDeleteResource(resourceId: string) {
    this.resourceService.deleteRessource(resourceId).subscribe(() => {
      this.farm.resources = this.farm.resources.filter(r => r.uuid_ressource !== resourceId);
    });
  }

  // ========== EXPENSES ==========
  getTotalExpenses(): number {
    if (!this.farm || !this.farm.expenses) return 0;
  
    return this.farm.expenses.reduce((total, expense) => total + expense.amount, 0);
  }
  toggleAddExpenseForm() {
    this.isAddExpenseFormVisible = !this.isAddExpenseFormVisible;
  }

  onAddExpense() {
    if (this.addExpenseForm.invalid) return;
  
    const newExpense: Expense = {
      expenseType: this.addExpenseForm.value.expenseType.trim(),
      amount: parseFloat(this.addExpenseForm.value.amount),
      date: this.addExpenseForm.value.date,
      description: this.addExpenseForm.value.description?.trim() || '',
      farm_id: this.farm.uuid_farm
    };
  
    this.expenseService.addExpense(newExpense, this.farm.uuid_farm).subscribe({
      next: (expense: Expense) => {
        this.farm.expenses.push(expense);
        this.isAddExpenseFormVisible = false;
        this.addExpenseForm.reset();
        //show a snackbar
        alert('Expense added successfully!');
      },
      error: (err) => {
        console.error('Failed to add expense:', err);
        //show a toast
        alert('Failed to add expense. Please try again.');

      }
    });
  }

  onDeleteExpense(expenseId: string) {
    this.expenseService.deleteExpense(expenseId).subscribe(() => {
      this.farm.expenses = this.farm.expenses.filter(e => e.uuid_expense !== expenseId);
    });
  }
}
