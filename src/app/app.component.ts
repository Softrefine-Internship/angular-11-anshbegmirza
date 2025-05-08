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

    this.rootEmployee = this.Employees.filter((emp) => {
      emp.managerId === null;
    });

    this.buildHierarchy(this.Employees);
  }

  getEmployeebyID(id: any) {
    return this.Employees.filter((emp) => {
      return emp.id === id ? emp : null;
    });
  }

  buildHierarchy(employees: Employee[]) {
    console.log('here goes your heirarchy code !');
    console.log(employees);

    const tree: any[] = [];
    const childOf: any[] = [];

    employees.forEach((item: any) => {
      const { id, managerId } = item;
      childOf[id] = childOf[id] || [];
      item.children = childOf[id];
      managerId
        ? (childOf[managerId] = childOf[managerId] || []).push(item)
        : tree.push(item);
    });
    console.log(tree);

    return tree;
  }

  onClickShowChildren(i: number) {
    const subordinates = this.Employees[i]?.subordinates;
    console.log(subordinates);
    let childs: any[] = [];
    if (subordinates && Array.isArray(subordinates)) {
      subordinates.forEach((childIndex) => {
        // console.log(childIndex);

        childs.push(this.getEmployeebyID(childIndex));
      });
      console.log(...childs);
    }
  }
}
