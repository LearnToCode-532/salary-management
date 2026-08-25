export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  currentSalary: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
export interface EmployeePage {
  content: Employee[];
  totalElements: number;
}