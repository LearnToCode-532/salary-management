import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';

import {
  CurrencyCode
} from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${environment.apiUrl}/exchange-rates`;

  getSupportedCurrencies():
    Observable<CurrencyCode[]> {

    return this.http.get<CurrencyCode[]>(
      `${this.baseUrl}/currencies`
    );
  }
}