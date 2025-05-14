import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EmployeeService } from '../shared/employee.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
})
export class AddDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empService: EmployeeService
  ) {}

  EmployeeForm!: FormGroup;
  nextId: number = 0;
  async gettingNextID() {
    this.nextId = await this.empService.getNextId();
    console.log(this.nextId);

    this.EmployeeForm.get('id')?.setValue(this.nextId);
  }

  ngOnInit(): void {
    this.EmployeeForm = new FormGroup({
      managerId: new FormControl(
        this.data.managerId ?? null,
        Validators.required
      ),
      id: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      imageUrl: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      designation: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.gettingNextID();
  }

  onSubmit() {
    if (this.EmployeeForm.invalid) {
      this.EmployeeForm.markAllAsTouched();
      return;
    }
    console.log(this.EmployeeForm.invalid, this.EmployeeForm.valid);

    if (this.EmployeeForm.valid) {
      this.empService.onAddEmployee(this.EmployeeForm.value);
      this.dialogRef.close(this.EmployeeForm.value);
      console.log('form submitted');
      console.log(this.EmployeeForm.value);
    }
  }

  onCancel() {
    console.log('cancelled');
    this.dialogRef.close(true);
  }
}
