import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './shared/employee.service';
import { Employee } from './shared/employee.model';
import { Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { inject, Injectable } from '@angular/core';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { ChangeDialogComponent } from './change-dialog/change-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-11';
  Employees: Employee[] = [];
  rootEmployee?: Employee | undefined = undefined;
  treeLevels: number = 0;
  childs: Employee[] = [];
  loading: boolean = false;
  // @Input() employee: Employee;
  hasError: boolean = false;
  errorMessage: string = `Error Message`;
  isDisabled: boolean = false;
  constructor(private dialog: MatDialog, private empService: EmployeeService) {}

  async ngOnInit(): Promise<void> {
    this.loadEmployees();
  }

  addEmployee() {
    console.log('Add employee button clicked');
    // check for 5 suborbs
    if (this.rootEmployee?.subordinates?.length === 4) {
      // this.isDisabled = true;
      this.errorMessage = 'You can add 1 more only !';
      this.hasError = true;
      return;
    }
    console.log(this.rootEmployee?.subordinates?.length);

    this.openAddDialog(this.rootEmployee?.id || 0);
  }

  async loadEmployees(): Promise<void> {
    this.loading = true;
    // await this.empService.seedEmployeeData();
    this.loading = false;
    this.empService.getEmployee((data) => {
      console.log('Fetched data from DB', data);

      this.Employees = data;

      this.rootEmployee = this.buildHierarchy(this.Employees);
      console.log('Root employee Now is :', this.rootEmployee);

      console.log('Employees reloaded', this.Employees);
    });
  }

  // Build hierarchy from flat data
  buildHierarchy(employees: Employee[]): Employee | undefined {
    const map = new Map<number, Employee>();

    employees.forEach((emp) => {
      emp.children = [];
      emp.isExpanded = false; // initially collapsed
      map.set(emp.id, emp);
    });

    let root: Employee | undefined;

    employees.forEach((emp) => {
      if (emp.managerId === null || emp.managerId === undefined) {
        root = emp;
      } else {
        const manager = map.get(emp.managerId);
        manager?.children?.push(emp);
      }
    });

    if (!root) {
      console.log('Root not found');
      this.hasError = true;
      this.errorMessage = `Root not found, please check the data`;
    }

    console.log('Root employee is', root);
    this.errorMessage = 'Root loaded';
    this.hasError = true;
    return root;
  }

  getEmployeebyID(id: number): Employee | undefined {
    return this.Employees.find((emp) => (emp.id === id ? emp : null));
  }

  onClickShowChildren(emp: Employee): void {
    console.log(emp);

    if (!emp.managerId) {
      // Root level toggle, no siblings to collapse
      emp.isExpanded = !emp.isExpanded;
      return;
    }

    const manager = this.getEmployeebyID(emp.managerId);
    console.log(manager);

    if (!manager || !manager.children) return;

    manager.children.forEach((sibling) => {
      // Collapse all siblings
      if (sibling.id !== emp.id) {
        sibling.isExpanded = false;
      }
    });

    // Toggle child visibility on click
    emp.isExpanded = !emp.isExpanded;
  }

  // opens add dialog
  openAddDialog(managerId: number) {
    console.log('Add component clicked');
    let dialogRef = this.dialog.open(AddDialogComponent, {
      width: '1000px',
      height: 'max-content',
      data: { managerId },
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        const nextId = this.empService.getNextId();
        result.id = nextId;
        this.loading = true;
        await this.empService.addEmployee(result);
        this.loading = false;
      }
    });
  }

  // opens delete dialog
  openDeleteDialog(empName: string, empId: number) {
    console.log('Delete dialog clicekd');

    const buttonEl = document.activeElement as HTMLElement;
    buttonEl.blur();

    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.autoFocus = false;
    let dialogRef = this.dialog.open(RemoveDialogComponent, {
      width: '450px',
      height: 'max-content',
      data: { empName, empId },
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        console.log(result.deletedID);
        this.empService.removeEmpById(result.deletedID);
        this.loadEmployees();
      }
    });
  }

  //change manager
  changeManager(empName: string, empId: number) {
    console.log('Manager changed');

    let dialogRef = this.dialog.open(ChangeDialogComponent, {
      width: '450px',
      height: 'max-content',
      data: {
        empName,
        empId,
      },
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        // await this.empService.updateManager(result.empId, result.managerId);
        await this.empService.swapRootWithEmployee(result.newRootID);
        this.loadEmployees();
        console.log('dialog closed');
      }
    });
  }
}
