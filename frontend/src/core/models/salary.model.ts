export interface Salary {
  employeeId: number;
  amount: number;
  currency: string;
  reportingAmount: number;
  reportingCurrency: string;
}
export interface SalaryHistoryResponse {
  id: number;
  employeeId: number;
  salary: number;
  currency: string;
  effectiveFrom: string; // LocalDate: YYYY-MM-DD
  createdAt: string; // Instant: ISO-8601
}

export interface SalaryResponse {
  employeeId: number;
  salary: number;
  currency: string;
  effectiveFrom: string; // LocalDate: YYYY-MM-DD
}

export interface UpdateSalaryRequest {
  salary: number;
  currency: string;
  effectiveFrom: string; // LocalDate: YYYY-MM-DD
}