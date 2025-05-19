import { Component, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../shared/employee.service';
import { Inject } from '@angular/core';

import { Employee } from '../shared/employee.model';
@Component({
  selector: 'app-change-dialog',
  templateUrl: './change-dialog.component.html',
  styleUrls: ['./change-dialog.component.scss'],
})
export class ChangeDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empService: EmployeeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadOtherEmployee();
  }

  loadOtherEmployee(): void {
    this.empService.getOtherEmployee(this.empId).subscribe((employees) => {
      this.otherEmployee = employees;
      console.log('loaded new other employees are', this.otherEmployee);
    });
  }

  empId = this.data.empId;
  selectedManagerId: number | null = null;
  otherEmployee: Employee[] = [];
  onCancel() {
    console.log('cancelled');
    this.dialogRef.close(true);
  }

  async onSubmit() {
    if (this.selectedManagerId) {
      // await this.empService.swapRootWithEmployee(this.selectedManagerId);
      this.dialogRef.close({
        newRootID: this.selectedManagerId,
      });
    }
  }
}
