export interface Employee {
  id: number;
  name: string;
  managerId: number | null;
  imageUrl: string;
  email: string;
  subordinates: any[] | null;
  designation: string;

  isExpanded?: boolean;
  children?: Employee[];
}
