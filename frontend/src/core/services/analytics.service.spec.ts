import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import { AnalyticsService } from './analytics.service';

import {
  SalarySummary,
  CountrySalarySummary
} from '../models/analytics.model';


describe('AnalyticsService', () => {

  let service: AnalyticsService;
  let httpMock: HttpTestingController;


  const summary: SalarySummary = {

    employeeCount: 100,

    totalSalary: 50000000,

    averageSalary: 500000,

    medianSalary: 450000,

    reportingCurrency: "USD"

  };


  const countrySummary:
    CountrySalarySummary[] = [

      {
        country: 'India',
        employeeCount: 60,
        totalSalary: 30000000,
        averageSalary: 500000,
        medianSalary: 450000,
        reportingCurrency: "INR"
      },

      {
        country: 'USA',
        employeeCount: 40,
        totalSalary: 20000000,
        averageSalary: 500000,
        medianSalary: 480000,
        reportingCurrency: "USD"
      }

    ];


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [

        AnalyticsService,

        provideHttpClient(),

        provideHttpClientTesting()

      ]

    });


    service =
      TestBed.inject(AnalyticsService);

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


  /*
   * getSummary()
   */

  it('should get salary summary without filters', () => {

    service
      .getSummary()
      .subscribe(response => {

        expect(response)
          .toEqual(summary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/analytics/summary'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    expect(
      request.request.params.has(
        'country'
      )
    ).toBe(false);


    expect(
      request.request.params.has(
        'currency'
      )
    ).toBe(false);


    request.flush(summary);

  });


  it('should get salary summary with country and currency filters', () => {

    service
      .getSummary(
        'India',
        'INR'
      )
      .subscribe(response => {

        expect(response)
          .toEqual(summary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/analytics/summary'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    expect(
      request.request.params.get(
        'country'
      )
    ).toBe('India');


    expect(
      request.request.params.get(
        'currency'
      )
    ).toBe('INR');


    request.flush(summary);

  });


  it('should get salary summary with only country filter', () => {

    service
      .getSummary('India')
      .subscribe(response => {

        expect(response)
          .toEqual(summary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/analytics/summary'
          )
      );


    expect(
      request.request.params.get(
        'country'
      )
    ).toBe('India');


    expect(
      request.request.params.has(
        'currency'
      )
    ).toBe(false);


    request.flush(summary);

  });


  it('should get salary summary with only currency filter', () => {

    service
      .getSummary(
        undefined,
        'USD'
      )
      .subscribe(response => {

        expect(response)
          .toEqual(summary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/analytics/summary'
          )
      );


    expect(
      request.request.params.has(
        'country'
      )
    ).toBe(false);


    expect(
      request.request.params.get(
        'currency'
      )
    ).toBe('USD');


    request.flush(summary);

  });


  /*
   * getCountrySummary()
   */

  it('should get country salary summary without currency filter', () => {

    service
      .getCountrySummary()
      .subscribe(response => {

        expect(response)
          .toEqual(countrySummary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/analytics/countries'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    expect(
      request.request.params.has(
        'currency'
      )
    ).toBe(false);


    request.flush(countrySummary);

  });


  it('should get country salary summary with currency filter', () => {

    service
      .getCountrySummary('USD')
      .subscribe(response => {

        expect(response)
          .toEqual(countrySummary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/analytics/countries'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    expect(
      request.request.params.get(
        'currency'
      )
    ).toBe('USD');


    request.flush(countrySummary);

  });


  /*
   * Error handling
   */

  it('should propagate getSummary HTTP error', () => {

    service
      .getSummary()
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
            '/analytics/summary'
          )
      );


    request.flush(
      'Unable to load analytics summary',
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );

  });


  it('should propagate getCountrySummary HTTP error', () => {

    service
      .getCountrySummary()
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
            '/analytics/countries'
          )
      );


    request.flush(
      'Unable to load country analytics',
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );

  });

});
