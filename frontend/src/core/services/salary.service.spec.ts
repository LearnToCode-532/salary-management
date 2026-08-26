import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';

import { SalaryService } from './salary.service';

import {
  SalaryResponse,
  UpdateSalaryRequest,
  SalaryHistoryResponse
} from '../models/salary.model';

describe('SalaryService', () => {

  let service: SalaryService;
  let httpMock: HttpTestingController;


  const salary: SalaryResponse = {

    employeeId: 1,

    salary: 500000,

    currency: 'INR',

    effectiveFrom: '2026-08-26'

  };


  const updateRequest: UpdateSalaryRequest = {

    salary: 600000,

    currency: 'INR',

    effectiveFrom: '2026-08-26'

  };


  const history: SalaryHistoryResponse = {

    id: 1,

    employeeId: 1,

    salary: 500000,

    currency: 'INR',

    effectiveFrom: '2026-01-01',

    createdAt: '2026-01-01T00:00:00Z',

  };


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [

        SalaryService,

        provideHttpClient(),

        provideHttpClientTesting()

      ]

    });


    service =
      TestBed.inject(SalaryService);

    httpMock =
      TestBed.inject(HttpTestingController);

  });


  afterEach(() => {

    httpMock.verify();

  });


  it('should create', () => {

    expect(service).toBeTruthy();

  });


  /*
   * Current salary
   */

  it('should get current salary', () => {

    service
      .getCurrentSalary(1)
      .subscribe(response => {

        expect(response)
          .toEqual(salary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/employees/1/salary'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    request.flush(salary);

  });


  /*
   * Update salary
   */

  it('should update salary', () => {

    service
      .updateSalary(
        1,
        updateRequest
      )
      .subscribe(response => {

        expect(response)
          .toEqual(salary);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/employees/1/salary'
          )
      );


    expect(
      request.request.method
    ).toBe('PUT');


    expect(
      request.request.body
    ).toEqual(updateRequest);


    request.flush(salary);

  });


  /*
   * Salary history
   */

  it('should get salary history with default pagination', () => {

    const response = {

      content: [
        history
      ],

      totalElements: 1,

      totalPages: 1,

      number: 0,

      size: 20

    };


    service
      .getSalaryHistory(1)
      .subscribe(result => {

        expect(result)
          .toEqual(response);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/employees/1/salary-history'
          )
      );


    expect(
      request.request.method
    ).toBe('GET');


    expect(
      request.request.params.get('page')
    ).toBe('0');


    expect(
      request.request.params.get('size')
    ).toBe('20');


    request.flush(response);

  });


  it('should get salary history with custom pagination', () => {

    const response = {

      content: [
        history
      ],

      totalElements: 41,

      totalPages: 3,

      number: 2,

      size: 20

    };


    service
      .getSalaryHistory(
        1,
        2,
        20
      )
      .subscribe(result => {

        expect(result)
          .toEqual(response);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/employees/1/salary-history'
          )
      );


    expect(
      request.request.params.get('page')
    ).toBe('2');


    expect(
      request.request.params.get('size')
    ).toBe('20');


    request.flush(response);

  });


  /*
   * Error handling
   */

  it('should propagate current salary error', () => {

    service
      .getCurrentSalary(1)
      .subscribe({

        next: () => {

          throw new Error(
            'Expected request to fail'
          );

        },

        error: error => {

          expect(error.status)
            .toBe(404);

        }

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/employees/1/salary'
          )
      );


    request.flush(
      'Salary not found',
      {
        status: 404,
        statusText: 'Not Found'
      }
    );

  });


  it('should propagate update salary error', () => {

    service
      .updateSalary(
        1,
        updateRequest
      )
      .subscribe({

        next: () => {

          throw new Error(
            'Expected request to fail'
          );

        },

        error: error => {

          expect(error.status)
            .toBe(400);

        }

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith(
            '/employees/1/salary'
          )
      );


    request.flush(
      'Invalid salary',
      {
        status: 400,
        statusText: 'Bad Request'
      }
    );

  });


  it('should propagate salary history error', () => {

    service
      .getSalaryHistory(
        1,
        0,
        20
      )
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
            '/employees/1/salary-history'
          )
      );


    request.flush(
      'Unable to load salary history',
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );

  });

});