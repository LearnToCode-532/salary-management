import {
  TestBed
} from '@angular/core/testing';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  EmployeeService
} from './employee.service';

import {
  Employee
} from '../models/employee.model';


describe('EmployeeService', () => {

  let service: EmployeeService;
  let httpMock: HttpTestingController;


  const employee: Employee = {

    id: 1,

    employeeCode: 'EMP001',

    firstName: 'John',

    lastName: 'Doe',

    email: 'john@example.com',

    country: 'India',

    currentSalary: 500000,

    currency: 'INR',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [

        EmployeeService,

        provideHttpClient(),

        provideHttpClientTesting()

      ]

    });


    service =
      TestBed.inject(EmployeeService);

    httpMock =
      TestBed.inject(HttpTestingController);

  });


  afterEach(() => {

    httpMock.verify();

  });


  it('should create', () => {

    expect(service).toBeTruthy();

  });


  it('should get an employee by id', () => {

    service
      .getEmployee(1)
      .subscribe(response => {

        expect(response)
          .toEqual(employee);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith('/1')
      );


    expect(request.request.method)
      .toBe('GET');


    request.flush(employee);

  });


  it('should get employees with pagination', () => {

    const response = {

      content: [
        employee
      ],

      totalElements: 1,

      totalPages: 1,

      number: 0,

      size: 20

    };


    service
      .getEmployees(
        0,
        20
      )
      .subscribe(result => {

        expect(result)
          .toEqual(response);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith('/employees')
      );


    expect(request.request.method)
      .toBe('GET');


    expect(
      request.request.params.get('page')
    ).toBe('0');


    expect(
      request.request.params.get('size')
    ).toBe('20');


    expect(
      request.request.params.has('search')
    ).toBe(false);


    request.flush(response);

  });


  it('should include search parameter when search is provided', () => {

    const response = {

      content: [],

      totalElements: 0,

      totalPages: 0,

      number: 0,

      size: 20

    };


    service
      .getEmployees(
        0,
        20,
        'John'
      )
      .subscribe(result => {

        expect(result)
          .toEqual(response);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith('/employees')
      );


    expect(
      request.request.params.get('page')
    ).toBe('0');


    expect(
      request.request.params.get('size')
    ).toBe('20');


    expect(
      request.request.params.get('search')
    ).toBe('John');


    request.flush(response);

  });


  it('should create an employee', () => {

    service
      .createEmployee(employee)
      .subscribe(response => {

        expect(response)
          .toEqual(employee);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith('/employees')
      );


    expect(request.request.method)
      .toBe('POST');


    expect(request.request.body)
      .toEqual(employee);


    request.flush(employee);

  });


  it('should update an employee', () => {

    const updateRequest = {

      firstName: 'Jane',

      lastName: 'Doe',

      email: 'jane@example.com',

      country: 'India'

    };


    service
      .updateEmployee(
        1,
        updateRequest
      )
      .subscribe(response => {

        expect(response)
          .toEqual(employee);

      });


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith('/employees/1')
      );


    expect(request.request.method)
      .toBe('PUT');


    expect(request.request.body)
      .toEqual(updateRequest);


    request.flush(employee);

  });


  it('should propagate get employee error', () => {

    service
      .getEmployee(1)
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
          req.url.endsWith('/1')
      );


    request.flush(
      'Employee not found',
      {
        status: 404,
        statusText: 'Not Found'
      }
    );

  });


  it('should propagate create employee error', () => {

    service
      .createEmployee(employee)
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
          req.url.endsWith('/employees')
      );


    request.flush(
      'Invalid employee',
      {
        status: 400,
        statusText: 'Bad Request'
      }
    );

  });


  it('should not include search parameter when search is empty', () => {

    service
      .getEmployees(
        0,
        20,
        ''
      )
      .subscribe();


    const request =
      httpMock.expectOne(
        req =>
          req.url.endsWith('/employees')
      );


    expect(
      request.request.params.has('search')
    ).toBe(false);


    request.flush({

      content: [],

      totalElements: 0,

      totalPages: 0,

      number: 0,

      size: 20

    });

  });


    it('should send sorting parameters when sorting is provided', () => {

    const response = {

        content: [],

        totalElements: 0,

        totalPages: 0,

        number: 0,

        size: 20

    };


    service
        .getEmployees(
        0,
        20,
        '',
        'employeeCode',
        'asc'
        )
        .subscribe();


    const request =
        httpMock.expectOne(
        req =>
            req.url.endsWith('/employees')
        );


    expect(
        request.request.params.get('sort')
    ).toBe(
        'employeeCode,asc'
    );


    request.flush(response);

    });

});