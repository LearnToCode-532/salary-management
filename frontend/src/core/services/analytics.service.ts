import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  SalarySummary,
  CountrySalarySummary
} from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/analytics`;

  getSummary(
    country?: string,
    currency?: string
  ): Observable<SalarySummary> {

    let params = new HttpParams();

    if (country) {
      params = params.set('country', country);
    }

    if (currency) {
      params = params.set('currency', currency);
    }

    return this.http.get<SalarySummary>(
      `${this.apiUrl}/summary`,
      { params }
    );
  }

  getCountrySummary(
    currency?: string
  ): Observable<CountrySalarySummary[]> {

    let params = new HttpParams();

    if (currency) {
      params = params.set('currency', currency);
    }

    return this.http.get<CountrySalarySummary[]>(
      `${this.apiUrl}/countries`,
      { params }
    );
  }
}