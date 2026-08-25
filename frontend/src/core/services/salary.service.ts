import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Salary } from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/employees`;

  getCurrentSalary(employeeId: number): Observable<Salary> {
    return this.http.get<Salary>(
      `${this.apiUrl}/${employeeId}/salary`
    );
  }

  updateSalary(
    employeeId: number,
    salary: Partial<Salary>
  ): Observable<Salary> {
    return this.http.put<Salary>(
      `${this.apiUrl}/${employeeId}/salary`,
      salary
    );
  }
}