import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Employee } from './employee.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private db: AngularFireDatabase) {}

  hasError: boolean = false;
  errorMessage: string = ``;

  getEmployee(callback: (employees: Employee[]) => void): void {
    this.db
      .object('employees')
      .valueChanges()
      .subscribe((data) => {
        const employees = data
          ? (Object.values(data as any) as Employee[])
          : [];
        callback(employees);
      });
  }

  async isDatabaseEmpty(): Promise<boolean> {
    let dbSnapshot = await this.db.object(`employees`).query.once('value');
    dbSnapshot = dbSnapshot.val();
    return dbSnapshot === null;
  }

  async onAddEmployee(emp: Employee) {
    try {
      const newId = await this.getNextId();
      emp.id = newId;

      const dbEmpty = await this.isDatabaseEmpty();

      if (dbEmpty) {
        emp.managerId = null;
        emp.subordinates = [];

        await this.addEmployee(emp);

        this.hasError = true;
        this.errorMessage = 'Root employee added successfully!';
        return;
      }

      // Otherwise, find the manager
      const managerSnapshot = await this.db
        .object(`employees/${emp.managerId}`)
        .query.once('value');
      const managerData = managerSnapshot.val();

      if (!managerData) {
        this.hasError = true;
        this.errorMessage = 'Manager not found';
        return;
      }

      if (managerData.subordinates && managerData.subordinates.length >= 5) {
        this.hasError = true;
        this.errorMessage =
          'This manager already has 5 subordinates. Please select another manager.';
        return;
      }

      await this.addEmployee(emp);

      const updatedSubordinates = managerData.subordinates ?? [];
      if (newId !== undefined && newId !== null) {
        updatedSubordinates.push(newId);

        await this.db
          .object(`employees/${emp.managerId}/subordinates`)
          .set(updatedSubordinates);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      this.hasError = true;
      this.errorMessage = 'An error occurred while adding the employee.';
    }
  }

  addEmployee(emp: Employee) {
    if (emp.subordinates === null || emp.subordinates === undefined) {
      emp.subordinates = [];
      // emp.subordinates.push(emp.id);
    }
    if (emp.subordinates.length > 4) {
      this.errorMessage = 'Max suborbs reached!';
      this.hasError = true;
      return;
    }
    return this.db.object(`employees/${emp.id}`).set(emp);
  }

  async getNextId(): Promise<number> {
    const snapshot = await this.db.object('employees').query.once('value');
    const employees = snapshot.val();
    const ids = employees ? Object.keys(employees).map(Number) : [0];
    return Math.max(...ids) + 1;
  }

  async removeEmpById(empId: number): Promise<void> {
    const employeeSnapshot = await this.db
      .object<Employee>(`employees/${empId}`)
      .query.once('value');
    const employee = employeeSnapshot.val();

    if (!employee) {
      console.error(`Employee with ID ${empId} not found.`);
      return;
    }

    const parentId = employee.managerId;

    if (parentId !== null && parentId !== undefined) {
      // Get parent employee
      const parentSnapshot = await this.db
        .object<Employee>(`employees/${parentId}`)
        .query.once('value');
      const parent = parentSnapshot.val();

      if (parent && parent.subordinates) {
        // Remove the deleted employee's ID from parent's subordinates
        const updatedSubordinates = parent.subordinates.filter(
          (id: number) => id !== empId
        );
        // console.log('updatedsubobrs on delete are', updatedSubordinates);

        await this.db
          .object(`employees/${parentId}/subordinates`)
          .set(updatedSubordinates);
      }
    }

    await this.db.object(`employees/${empId}`).remove();
  }

  // live fetching
  getOtherEmployee(empId: number): Observable<Employee[]> {
    return this.db
      .list<Employee>('employees')
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes
            .map((c) => {
              const data = c.payload.val() as Employee;
              return {
                ...data,
                id: data.id ?? -1,
                subordinates: data.subordinates ?? [],
              } as Employee;
            })
            .filter((emp) => emp.id !== empId)
        )
      );
  }

  async updateManager(empId: number, newManagerId: number): Promise<void> {
    const empRef = this.db.object(`employees/${empId}`);
    await empRef.update({ managerId: newManagerId });
  }

  async swapRootWithEmployee(selectedEmployeeId: number): Promise<void> {
    const dbRef = this.db.database.ref('employees');

    const [rootSnap, selectedSnap] = await Promise.all([
      dbRef.child('1').get(),
      dbRef.child(String(selectedEmployeeId)).get(),
    ]);

    const rootData = rootSnap.val();
    const selectedData = selectedSnap.val();
    console.log(selectedSnap.val(), rootSnap.val());

    if (!rootData || !selectedData) {
      console.error('Either root or selected employee not found.');
      return;
    }

    const newRoot: Employee = {
      ...selectedData,
      id: 1,
      managerId: null,
      subordinates: rootData.subordinates || [],
      children: rootData.children || [],
    };

    const newOldRoot: Employee = {
      ...rootData,
      id: selectedEmployeeId,
      managerId: selectedData.managerId,
      subordinates: selectedData.subordinates || [],
    };

    const snapshot = await dbRef.get();
    const allEmployees: { [key: string]: Employee } = snapshot.val();

    const updates: Record<string, any> = {};
    updates[`1`] = newRoot;
    updates[`${selectedEmployeeId}`] = newOldRoot;

    await dbRef.update(updates);
  }
}

/* OLD PREFILLED DATA PROVIDED IN THE TEST PDF */
/*
// async seedEmployeeData(): Promise<void> {
  //   const employees: Employee[] = [
  //     {
  //       id: 1,
  //       name: 'John Doe',
  //       managerId: null,
  //       imageUrl:
  //         'https://images.generated.photos/rJAUHO0BIo3HPTZHmRquIELKHzFv9aGQVup9gAcohas/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDI0NDIxLmpwZw.jpg',
  //       email: 'john.doe@example.com',
  //       subordinates: [2, 3],
  //       designation: 'CEO',
  //     },
  //     {
  //       id: 2,
  //       name: 'Jane Smith',
  //       managerId: 1,
  //       imageUrl:
  //         'https://images.generated.photos/sQO382vTFE2AeD_55KCemqzo9YoEzxcDB92Vd7QUgCk/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/ODg1NTM3LmpwZw.jpg',
  //       email: 'jane.smith@example.com',
  //       subordinates: [4, 5],
  //       designation: 'CTO',
  //     },
  //     {
  //       id: 3,
  //       name: 'Bob Johnson',
  //       managerId: 1,
  //       imageUrl:
  //         'https://images.generated.photos/Mlz6ZD6FvX9HHsEQFmcjcpTScjUBmwddGSAMi3QWqhM/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjY5NjU0LmpwZw.jpg',
  //       email: 'bob.johnson@example.com',
  //       subordinates: [6],
  //       designation: 'CFO',
  //     },
  //     {
  //       id: 4,
  //       name: 'Alice Brown',
  //       managerId: 2,

  //       imageUrl:
  //         'https://images.generated.photos/pHgnRFp13HMBvBeKXNq-x-d7rpx-Fc0FPQXGT5DyOj8/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDEwMTUyLmpwZw.jpg',
  //       email: 'alice.brown@example.com',
  //       subordinates: [],
  //       designation: 'Engineering Manager',
  //     },
  //     {
  //       id: 5,
  //       name: 'Charlie White',
  //       managerId: 2,
  //       imageUrl:
  //         'https://images.generated.photos/sWdaNHkJvJRJQ85esJbPM7QmIb-xxFI9u4R3oNJb6k0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NTczNDgxLmpwZw.jpg',
  //       email: 'charlie.white@example.com',
  //       subordinates: [],
  //       designation: 'Product Manager',
  //     },
  //     {
  //       id: 6,
  //       name: 'David Black',
  //       managerId: 3,
  //       imageUrl:
  //         'https://images.generated.photos/fJ_gE4TmTMNkcU3WgAFx3tR6NZNMQQ4Ni_2vNClAedY/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjMxODE4LmpwZw.jpg',
  //       email: 'david.black@example.com',
  //       subordinates: [7],
  //       designation: 'Finance Manager',
  //     },
  //     {
  //       id: 7,
  //       name: 'Eva Green',
  //       managerId: 6,
  //       imageUrl:
  //         'https://images.generated.photos/65R9EbABt8z4qMO19kVryWt_BQ2K04RuHQb-fEftpO0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDY5MDIxLmpwZw.jpg',
  //       email: 'eva.green@example.com',
  //       subordinates: [],
  //       designation: 'Accountant',
  //     },
  //   ];

  //   const snapshot = await this.db.object('employees').query.once('value');
  //   if (snapshot.exists()) {
  //     // console.log('Employee data already exists. Skipping seed.');
  //     return;
  //   }
  //   const promises = employees.map((emp) => {
  //     return this.db
  //       .object(`employees/${emp.id}`)
  //       .set(JSON.parse(JSON.stringify(emp)));
  //   });

  //   return Promise.all(promises).then(() => {
  //     console.log('All employees seeded.');
  //   });
  // }
  */
