import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ActivatedRoute
} from '@angular/router';

import {
  of,
  throwError
} from 'rxjs';

import {
  EmployeeDetail
} from './employee-detail';

import {
  EmployeeService
} from '../../../../core/services/employee.service';


describe('EmployeeDetail', () => {

  let fixture: ComponentFixture<EmployeeDetail>;
  let component: EmployeeDetail;


  /*
   * --------------------------------------------------
   * Mocks
   * --------------------------------------------------
   */

  const employeeServiceMock = {

    getEmployee: vi.fn()

  };


  /*
   * --------------------------------------------------
   * Setup
   * --------------------------------------------------
   */

  beforeEach(async () => {

    employeeServiceMock.getEmployee.mockReset();


    /*
     * Default employee response
     */

    employeeServiceMock.getEmployee.mockReturnValue(

      of({

        id: 1,

        employeeCode: 'EMP001',

        firstName: 'John',

        lastName: 'Doe',

        email: 'john@example.com',

        country: 'India',

        currentSalary: 500000,

        currency: 'INR'

      })

    );


    await TestBed.configureTestingModule({

      imports: [

        EmployeeDetail

      ],

      providers: [

        {
          provide: EmployeeService,

          useValue: employeeServiceMock

        },

        {
          provide: ActivatedRoute,

          useValue: {

            snapshot: {

              paramMap: {

                get: vi.fn()
                  .mockReturnValue('1')

              }

            }

          }

        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(EmployeeDetail);

    component =
      fixture.componentInstance;

  });


  /*
   * ==================================================
   * BASIC
   * ==================================================
   */

  it('should create', () => {

    expect(component).toBeTruthy();

  });


  /*
   * ==================================================
   * SUCCESS
   * ==================================================
   */

  it('should load employee on initialization', () => {

    component.ngOnInit();


    expect(
      employeeServiceMock.getEmployee
    ).toHaveBeenCalledWith(1);


    expect(
      component.employee()
    ).toEqual({

      id: 1,

      employeeCode: 'EMP001',

      firstName: 'John',

      lastName: 'Doe',

      email: 'john@example.com',

      country: 'India',

      currentSalary: 500000,

      currency: 'INR'

    });


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(false);

  });


  /*
   * ==================================================
   * API ERROR
   * ==================================================
   */

  it('should handle employee loading error', () => {

    employeeServiceMock.getEmployee.mockReturnValue(

      throwError(
        () => new Error('Employee not found')
      )

    );


    component.ngOnInit();


    expect(
      employeeServiceMock.getEmployee
    ).toHaveBeenCalledWith(1);


    expect(
      component.employee()
    ).toBeNull();


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(true);

  });


  /*
   * ==================================================
   * INVALID ID
   * ==================================================
   */

  it('should handle missing employee id', () => {

    const activatedRoute =
      TestBed.inject(ActivatedRoute) as any;


    activatedRoute.snapshot.paramMap.get
      .mockReturnValue(null);


    component.ngOnInit();


    expect(
      employeeServiceMock.getEmployee
    ).not.toHaveBeenCalled();


    expect(
      component.employee()
    ).toBeNull();


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(true);

  });


  /*
   * ==================================================
   * INVALID ID = ZERO
   * ==================================================
   */

  it('should handle employee id zero', () => {

    const activatedRoute =
      TestBed.inject(ActivatedRoute) as any;


    activatedRoute.snapshot.paramMap.get
      .mockReturnValue('0');


    component.ngOnInit();


    expect(
      employeeServiceMock.getEmployee
    ).not.toHaveBeenCalled();


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(true);

  });


  /*
   * ==================================================
   * INVALID ID = NON-NUMERIC
   * ==================================================
   */

  it('should handle non-numeric employee id', () => {

    const activatedRoute =
      TestBed.inject(ActivatedRoute) as any;


    activatedRoute.snapshot.paramMap.get
      .mockReturnValue('abc');


    component.ngOnInit();


    expect(
      employeeServiceMock.getEmployee
    ).not.toHaveBeenCalled();


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(true);

  });

});