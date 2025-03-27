import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './shared/employee.service';
import { Employee } from './shared/employee.model';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-11';
  Employees: Employee[] = [];
  rootEmployee: Employee[] = [];
  treeLevels: number = 0;

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.Employees = this.empService.getEmployee();
    // console.log(this.Employees);

    this.rootEmployee = this.Employees.filter((emp) => {
      emp.managerId === null;
    });

    this.buildHierarchy(this.Employees);
  }

  getEmployeebyID(id: any) {
    return this.Employees.filter((emp) => {
      return emp.id === id;
    });
  }

  buildHierarchy(employees: Employee[]): any {
    const employeeMap: { [id: number]: Employee } = {};

    employees.forEach((employee) => {
      employeeMap[employee.id] = employee;
    });

    const hierarchy = employees.filter((employee) => {
      if (employee.managerId === null) {
        return true;
      }
      const manager = employeeMap[employee.managerId];
      let subordinates = [];
      // console.log('I am the manager.', manager);

      if (manager) {
        if (!manager.subordinates) {
          manager.subordinates = [];
        }
        subordinates = [...manager.subordinates];
        console.log(subordinates);
        subordinates.forEach((id) => {
          manager.subordinates?.push(this.getEmployeebyID(id));
          console.log(this.getEmployeebyID(id));
        });
      }
      return false;
    });
    // console.log('this is the hierarchy', hierarchy);
    console.log(hierarchy);
    return hierarchy;
  }
}
