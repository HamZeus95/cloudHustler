import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatGroup } from '../../models/chat-group.model';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.css']
})
export class GroupDialogComponent implements OnInit {
  groupForm: FormGroup;
  isEdit = false;
  title = 'Create New Group';
  submitButtonText = 'Create';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<ChatGroup>
  ) {
    // Initialize the form
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]]
    });
    
    // Check if editing an existing group
    if (data && data.id) {
      this.isEdit = true;
      this.title = 'Edit Group';
      this.submitButtonText = 'Save Changes';
      this.groupForm.patchValue({
        name: data.name,
        description: data.description
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.groupForm.valid) {
      this.dialogRef.close(this.groupForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}