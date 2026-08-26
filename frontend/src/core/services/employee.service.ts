import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/employees`;

  getEmployees(
    page: number,
    size: number,
    search?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ): Observable<PageResponse<Employee>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) {
      params = params.set(
        'search',
        search
      );
    }

    if (sortBy) {
      params = params.set(
        'sort',
        `${sortBy},${sortDirection ?? 'asc'}`
      );
    }

    return this.http.get<PageResponse<Employee>>(
      this.apiUrl,
      { params }
    );
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(
    id: number,
    employee: Partial<Employee>
  ): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }
}