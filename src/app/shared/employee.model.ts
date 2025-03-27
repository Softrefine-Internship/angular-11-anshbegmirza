export interface Employee {
  id: number;
  name: string;
  managerId: number | null;
  imageUrl: string;
  email: string;
  subordinates: any[] | null;
  children?: [];
  designation: string;
}
