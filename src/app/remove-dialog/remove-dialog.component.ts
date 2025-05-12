import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../shared/employee.service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss'],
})
export class RemoveDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empService: EmployeeService
  ) {}

  empName: string = this.data.empName;

  onCancel() {
    console.log('cancelled');
    this.dialogRef.close(true);
  }

  onSubmit() {
    console.log('form submitted');
    this.empService.removeEmpById(this.data.empId);
    this.dialogRef.close(true);
  }
}
