import { Component, OnInit, Output, EventEmitter, Input, inject } from '@angular/core';
import { ChatGroupService } from '../../../services/chat-group.service';
import { ChatGroup } from '../../../models/chat-group.model';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	imports: [FormsModule, CommonModule],
	template: `
		<div class="modal-header">
			<h4 class="modal-title">{{isEditing ? 'Edit Group' : 'Create New Group'}}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<form>
				<div class="mb-3">
					<label for="groupName" class="form-label">Group Name</label>
					<input 
						type="text" 
						class="form-control" 
						id="groupName" 
						[(ngModel)]="group.name" 
						name="name"
						required
						minlength="3"
						maxlength="50"
						#nameInput="ngModel">
					<div class="text-danger" *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)">
						<small *ngIf="nameInput.errors?.['required']">Group name is required</small>
						<small *ngIf="nameInput.errors?.['minlength']">Group name must be at least 3 characters</small>
						<small *ngIf="nameInput.errors?.['maxlength']">Group name cannot exceed 50 characters</small>
					</div>
				</div>
				<div class="mb-3">
					<label for="groupDescription" class="form-label">Description (optional)</label>
					<textarea 
						class="form-control" 
						id="groupDescription" 
						rows="3" 
						[(ngModel)]="group.description" 
						name="description"
						maxlength="200"
						#descInput="ngModel"></textarea>
					<div class="text-danger" *ngIf="descInput.invalid && (descInput.dirty || descInput.touched)">
						<small *ngIf="descInput.errors?.['maxlength']">Description cannot exceed 200 characters</small>
					</div>
					<small class="form-text text-muted">
						{{group.description?.length || 0}}/200 characters
					</small>
				</div>
			</form>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss('Cancel')">Cancel</button>
			<button 
				type="button" 
				class="btn btn-primary" 
				[disabled]="nameInput.invalid"
				(click)="activeModal.close(group)">
				{{isEditing ? 'Save Changes' : 'Create Group'}}
			</button>
		</div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);

	group: { name: string; description?: string; id?: string } = {
		name: '',
		description: ''
	};
	
	isEditing: boolean = false;
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @Input() currentUser: any;
  @Input() groupSearchTerm: string = '';
  @Input() isGroupSearching: boolean = false;
  @Input() groupSearchResults: ChatGroup[] = [];
  @Input() adminGroups: ChatGroup[] = [];
  @Input() memberGroups: ChatGroup[] = [];
  
  @Output() selectGroup = new EventEmitter<ChatGroup>();
  @Output() groupDeleted = new EventEmitter<string>();
  @Output() groupLeft = new EventEmitter<string>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() createGroup = new EventEmitter<{name: string, description: string}>();
  
  searchTermChanged = new Subject<string>();

  private modalService = inject(NgbModal);
  
  constructor(
    private chatGroupService: ChatGroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Set up debounced search
    this.searchTermChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTermChange.emit(term);
    });
  }
  
  ngOnInit(): void {
    // The parent component will now provide the groups data
    this.loadGroups();
  }
  
  onSearchInput(event: any): void {
    const term = event.target.value;
    this.searchTermChanged.next(term);
  }
  
  selectGroupChat(group: ChatGroup): void {
    this.selectGroup.emit(group);
  }
  
  openCreateGroupDialog(): void {
    const modalRef = this.modalService.open(NgbdModalContent);
    
    // Add a console log to track when the modal is opened
    console.log("Modal opened for group creation");
    
    modalRef.result.then(
      (formData) => {
        console.log("Modal closed with data:", formData);
        if (formData && formData.name) {
          // Only emit the event to let the parent component create the group
          // This prevents duplicate group creation
          this.createGroup.emit(formData);
          
          // We'll get the new groups through the loadGroups() call
          // which will be triggered by the parent component after it creates the group
        }
      },
      (dismissReason) => {
        // Modal was dismissed, do nothing
        console.log('Modal dismissed:', dismissReason);
      }
    );
  }
  
  editGroup(group: ChatGroup): void {
    // Open the modal dialog for editing
    const modalRef = this.modalService.open(NgbdModalContent);
    
    // Set modal to edit mode and pass group data
    modalRef.componentInstance.isEditing = true;
    modalRef.componentInstance.group = {
      id: group.id,
      name: group.name,
      description: group.description
    };
    
    console.log("Modal opened for group editing:", group.id);
    
    modalRef.result.then(
      (updatedData) => {
        console.log("Modal closed with updated data:", updatedData);
        if (updatedData && updatedData.name) {
          // Use the ChatGroupService to update the group
          this.chatGroupService.updateGroup(group.id, {
            name: updatedData.name,
            description: updatedData.description
          }).subscribe({
            next: (updatedGroup) => {
              console.log("Group updated successfully:", updatedGroup);
              this.snackBar.open(`Group "${updatedGroup.name}" updated successfully!`, 'Close', { 
                duration: 3000,
                panelClass: 'success-snackbar'
              });
              
              // Refresh groups list
              this.loadGroups();
            },
            error: (error) => {
              console.error('Error updating group:', error);
              this.snackBar.open('Failed to update group. Please try again.', 'Close', { 
                duration: 5000,
                panelClass: 'error-snackbar'
              });
            }
          });
        }
      },
      (dismissReason) => {
        console.log('Modal dismissed:', dismissReason);
      }
    );
  }
  
  deleteGroup(groupId: string): void {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      this.groupDeleted.emit(groupId);
    }
  }
  
  leaveGroup(groupId: string): void {
    if (confirm('Are you sure you want to leave this group?')) {
      this.groupLeft.emit(groupId);
    }
  }

  // Load groups from the service
  loadGroups(): void {
    // Only use one method to load all groups to prevent duplicate API calls
    this.chatGroupService.getUserGroups().subscribe({
      next: (groups) => {
        this.adminGroups = groups.filter(group => group.isCurrentUserAdmin);
        this.memberGroups = groups.filter(group => !group.isCurrentUserAdmin);
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.snackBar.open('Failed to load groups', 'Close', { duration: 3000 });
      }
    });
  }
}
