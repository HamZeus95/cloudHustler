import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static validStatutLivraison(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^(PENDING|IN_TRANSIT|DELIVERED)$/.test(control.value);
      return valid ? null : { invalidStatut: true };
    };
  }

  static validStatutFacture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^(PAID|PENDING|CANCELLED)$/.test(control.value);
      return valid ? null : { invalidStatut: true };
    };
  }

  static dateIsToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      const inputDate = new Date(control.value);
      return today.toDateString() === inputDate.toDateString() ? null : { notToday: true };
    };
  }

  static futureDateOrToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      return inputDate >= today ? null : { pastDate: true };
    };
  }

  static matchLivraisonDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      
      const livraison = control.parent.get('livraison')?.value;
      if (!livraison?.dateLivraison) return null;
      
      const dateEmission = new Date(control.value);
      const dateCreation = new Date(livraison.dateCreation);
      
      return dateEmission.toDateString() === dateCreation.toDateString() 
        ? null 
        : { dateMismatch: true };
    };
  }
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  static matchLivraisonDate1(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent || !control.value) return null;
      
      const livraison = control.parent.get('livraison')?.value;
      if (!livraison?.dateCreation) return null;
      
      const dateEmission = new Date(control.value);
      const dateCreation = new Date(livraison.dateCreation);
      
      return dateEmission > dateCreation ? { invalidDate: true } : null;
    };
  }

  static validStatutFacture1(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const validStatuses = ['EN ATTENTE'];
      //      const validStatuses = ['PAYÉE', 'EN ATTENTE', 'ANNULÉE'];

      return validStatuses.includes(control.value?.toUpperCase()) ? null : { invalidStatus: true };
    };
  }

  static matchTotalPrice(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const livraison = control.parent.get('livraison')?.value;
      if (!livraison?.ordre?.totalPrice) return null;

      const montantTotal = control.value;
      return montantTotal === livraison.ordre.totalPrice
        ? null
        : { totalPriceMismatch: true };
    };
  }
}
