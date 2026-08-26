import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {
  SalaryResponse,
  UpdateSalaryRequest,
  SalaryHistoryResponse
} from '../models/salary.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/employees`;

  getCurrentSalary(employeeId: number): Observable<SalaryResponse> {
    return this.http.get<SalaryResponse>(
      `${this.baseUrl}/${employeeId}/salary`
    );
  }

  updateSalary(
    employeeId: number,
    request: UpdateSalaryRequest
  ): Observable<SalaryResponse> {
    return this.http.put<SalaryResponse>(
      `${this.baseUrl}/${employeeId}/salary`,
      request
    );
  }

  getSalaryHistory(
    employeeId: number,
    page = 0,
    size = 20
  ): Observable<PageResponse<SalaryHistoryResponse>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<SalaryHistoryResponse>>(
      `${this.baseUrl}/${employeeId}/salary-history`,
      { params }
    );
  }
}