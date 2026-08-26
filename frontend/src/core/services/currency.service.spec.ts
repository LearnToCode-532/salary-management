import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import { CurrencyService } from './currency.service';

import {
  CurrencyCode
} from '../models/currency.model';


describe('CurrencyService', () => {

  let service: CurrencyService;
  let httpMock: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [

        CurrencyService,

        provideHttpClient(),

        provideHttpClientTesting()

      ]

    });


    service =
      TestBed.inject(CurrencyService);

    httpMock =
      TestBed.inject(
        HttpTestingController
      );

  });


  afterEach(() => {

    httpMock.verify();

  });


  it('should create', () => {

    expect(service).toBeTruthy();

  });


  it('should get supported currencies', () => {

    const currencies:
      CurrencyCode[] = [
        'INR',
        'USD',
        'EUR'
      ];


    service
      .getSupportedCurrencies()
      .subscribe(response => {

        expect(response)
          .toEqual(currencies);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/exchange-rates/currencies'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    request.flush(currencies);

  });


  it('should propagate HTTP error', () => {

    service
      .getSupportedCurrencies()
      .subscribe({

        next: () => {

          throw new Error(
            'Expected request to fail'
          );

        },

        error: error => {

          expect(error.status)
            .toBe(500);

        }

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/exchange-rates/currencies'
          )
      );


    request.flush(
      'Unable to load currencies',
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );

  });

});