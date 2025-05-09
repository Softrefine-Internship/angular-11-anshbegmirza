import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './shared/employee.service';
import { Employee } from './shared/employee.model';
import { Input } from '@angular/core';
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
  rootEmployee?: Employee | undefined = undefined;
  treeLevels: number = 0;
  childs: Employee[] = [];

  // @Input() employee: Employee;

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.Employees = this.empService.getEmployee();
    this.rootEmployee = this.buildHierarchy(this.Employees);

    console.log('Fetched data is', this.Employees);
    console.log('Root employee is', this.rootEmployee);

    // this.rootEmployee = this.getEmployeebyID(1);
    // console.log(this.rootEmployee);
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
      if (emp.managerId === null) {
        root = emp;
      } else {
        const manager = map.get(emp.managerId);
        manager?.children?.push(emp);
      }
    });

    return root;
  }

  getEmployeebyID(id: number): Employee | undefined {
    return this.Employees.find((emp) => (emp.id === id ? emp : null));
  }

  // Toggle child visibility on click
  onClickShowChildren(emp: Employee): void {
    emp.isExpanded = !emp.isExpanded;
  }
}

/*
 onClickShowChildren(empId: number): void {
    // const subordinates = this.Employees[empId]?.subordinates;
    const employee = this.getEmployeebyID(empId);

    console.log(`this is clicked Employee id`, empId);
    console.log('this employee clicked', this.Employees[0]);
    // console.log(`these are suborbs`, subordinates);

    if (employee && Array.isArray(employee.subordinates)) {
      this.childs = employee.subordinates
        .map((childIndex) => this.getEmployeebyID(childIndex))
        .filter((emp): emp is Employee => !!emp);

      console.log('Child employees are:', this.childs);
    } else {
      this.childs = [];
    }
  }


  // buildHierarchy(employees: Employee[]) {
  //   console.log('here goes your heirarchy code !');
  //   console.log(employees);

  //   const tree: any[] = [];
  //   const childOf: any[] = [];

  //   employees.forEach((item: any) => {
  //     const { id, managerId } = item;
  //     childOf[id] = childOf[id] || [];
  //     item.children = childOf[id];
  //     managerId
  //       ? (childOf[managerId] = childOf[managerId] || []).push(item)
  //       : tree.push(item);
  //   });
  //   console.log(tree);

  //   return tree;
  // }

  */
