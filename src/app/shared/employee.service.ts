import { Injectable } from '@angular/core';

import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor() {}

  employee: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      managerId: null, // parent id
      imageUrl:
        'https://images.generated.photos/rJAUHO0BIo3HPTZHmRquIELKHzFv9aGQVup9gAcohas/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDI0NDIxLmpwZw.jpg',
      email: 'john.doe@example.com',
      subordinates: [2, 3], // child ids
      designation: 'CEO',
    },
    {
      id: 2,
      name: 'Jane Smith',
      managerId: 1,
      imageUrl:
        'https://images.generated.photos/sQO382vTFE2AeD_55KCemqzo9YoEzxcDB92Vd7QUgCk/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/ODg1NTM3LmpwZw.jpg',
      email: 'jane.smith@example.com',
      subordinates: [4, 5],
      designation: 'CTO',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      managerId: 1,
      imageUrl:
        'https://images.generated.photos/Mlz6ZD6FvX9HHsEQFmcjcpTScjUBmwddGSAMi3QWqhM/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjY5NjU0LmpwZw.jpg',
      email: 'bob.johnson@example.com',
      subordinates: [6],
      designation: 'CFO',
    },
    {
      id: 4,
      name: 'Alice Brown',
      managerId: 2,

      imageUrl:
        'https://images.generated.photos/pHgnRFp13HMBvBeKXNq-x-d7rpx-Fc0FPQXGT5DyOj8/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDEwMTUyLmpwZw.jpg',
      email: 'alice.brown@example.com',
      subordinates: [8, 9],
      designation: 'Engineering Manager',
    },
    {
      id: 5,
      name: 'Charlie White',
      managerId: 2,
      imageUrl:
        'https://images.generated.photos/sWdaNHkJvJRJQ85esJbPM7QmIb-xxFI9u4R3oNJb6k0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NTczNDgxLmpwZw.jpg',
      email: 'charlie.white@example.com',
      subordinates: [10, 11],
      designation: 'Product Manager',
    },
    {
      id: 6,
      name: 'David Black',
      managerId: 3,
      imageUrl:
        'https://images.generated.photos/fJ_gE4TmTMNkcU3WgAFx3tR6NZNMQQ4Ni_2vNClAedY/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjMxODE4LmpwZw.jpg',
      email: 'david.black@example.com',
      subordinates: [7],
      designation: 'Finance Manager',
    },
    {
      id: 7,
      name: 'Eva Green',
      managerId: 6,
      imageUrl:
        'https://images.generated.photos/65R9EbABt8z4qMO19kVryWt_BQ2K04RuHQb-fEftpO0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDY5MDIxLmpwZw.jpg',
      email: 'eva.green@example.com',
      subordinates: null,
      designation: 'Accountant',
    },
  ];

  getEmployee() {
    return [...this.employee];
  }
}
