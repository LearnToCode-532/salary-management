import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  of,
  throwError
} from 'rxjs';

import {
  EmployeeForm
} from './employee-form';

import {
  EmployeeService
} from '../../../../core/services/employee.service';

import {
  SalaryService
} from '../../../../core/services/salary.service';

import {
  CurrencyService
} from '../../../../core/services/currency.service';


describe('EmployeeForm', () => {

  let fixture: ComponentFixture<EmployeeForm>;
  let component: EmployeeForm;


  /*
   * --------------------------------------------------
   * Mocks
   * --------------------------------------------------
   */

  const employeeServiceMock = {

    getEmployee: vi.fn(),

    createEmployee: vi.fn(),

    updateEmployee: vi.fn()

  };


  const salaryServiceMock = {

    updateSalary: vi.fn()

  };


  const currencyServiceMock = {

    getSupportedCurrencies: vi.fn()

  };


  const routerMock = {

    navigate: vi.fn()

  };


  /*
   * --------------------------------------------------
   * Helper
   * --------------------------------------------------
   */

  function setValidForm(): void {

    component.form.patchValue({

      employeeCode: 'EMP001',

      firstName: 'John',

      lastName: 'Doe',

      email: 'john@example.com',

      country: 'India',

      currentSalary: 500000,

      currency: 'INR'

    });

  }


  /*
   * --------------------------------------------------
   * Setup
   * --------------------------------------------------
   */

  beforeEach(async () => {

    /*
     * Reset mocks
     */

    employeeServiceMock.getEmployee.mockReset();

    employeeServiceMock.createEmployee.mockReset();

    employeeServiceMock.updateEmployee.mockReset();

    salaryServiceMock.updateSalary.mockReset();

    currencyServiceMock.getSupportedCurrencies.mockReset();

    routerMock.navigate.mockReset();


    /*
     * Default currency response.
     *
     * EmployeeForm loads currencies in ngOnInit().
     * This also enables the currency form control.
     */

    currencyServiceMock.getSupportedCurrencies.mockReturnValue(
      of([
        'EUR',
        'INR',
        'USD'
      ])
    );


    /*
     * Default employee response.
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


    /*
     * Default create response.
     */

    employeeServiceMock.createEmployee.mockReturnValue(

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


    /*
     * Default employee update response.
     */

    employeeServiceMock.updateEmployee.mockReturnValue(

      of({

        id: 1,

        employeeCode: 'EMP001',

        firstName: 'John',

        lastName: 'Doe',

        email: 'john@example.com',

        country: 'India',

        currentSalary: 600000,

        currency: 'INR'

      })

    );


    /*
     * Default salary update response.
     */

    salaryServiceMock.updateSalary.mockReturnValue(

      of({})

    );


    /*
     * Configure TestBed.
     */

    await TestBed.configureTestingModule({

      imports: [

        EmployeeForm

      ],

      providers: [

        {
          provide: EmployeeService,

          useValue: employeeServiceMock

        },

        {
          provide: SalaryService,

          useValue: salaryServiceMock

        },

        {
          provide: CurrencyService,

          useValue: currencyServiceMock

        },

        {
          provide: Router,

          useValue: routerMock

        },

        {
          provide: ActivatedRoute,

          useValue: {

            snapshot: {

              paramMap: {

                get: () => null

              }

            }

          }

        }

      ]

    }).compileComponents();


    /*
     * Create component.
     */

    fixture =
      TestBed.createComponent(EmployeeForm);

    component =
      fixture.componentInstance;


    /*
     * Run initialization manually.
     *
     * This loads currencies and enables
     * the currency control.
     */

    component.ngOnInit();

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
   * CREATE MODE
   * ==================================================
   */

  it('should initialize in create mode', () => {

    expect(
      component.editMode()
    ).toBe(false);

    expect(
      component.loading()
    ).toBe(false);

    expect(
      component.error()
    ).toBe(false);

  });


  /*
   * ==================================================
   * FORM VALIDATION
   * ==================================================
   */

  it('should mark form invalid when required fields are missing', () => {

    component.form.reset();

    expect(
      component.form.invalid
    ).toBe(true);

  });


  it('should validate currency format', () => {

    const currency =
      component.form.controls.currency;


    /*
     * Empty
     */

    currency.setValue('');

    expect(
      currency.invalid
    ).toBe(true);


    /*
     * Less than 3 characters
     */

    currency.setValue('IN');

    expect(
      currency.invalid
    ).toBe(true);


    /*
     * Lowercase

     */

    currency.setValue('inr');

    expect(
      currency.invalid
    ).toBe(true);


    /*
     * Valid ISO-style currency code
     */

    currency.setValue('INR');

    expect(
      currency.valid
    ).toBe(true);

  });


  it('should validate negative salary', () => {

    const salary =
      component.form.controls.currentSalary;


    salary.setValue(-1);

    expect(
      salary.invalid
    ).toBe(true);


    salary.setValue(0);

    expect(
      salary.valid
    ).toBe(true);


    salary.setValue(500000);

    expect(
      salary.valid
    ).toBe(true);

  });


  /*
   * ==================================================
   * CREATE EMPLOYEE
   * ==================================================
   */

  it('should create a new employee', () => {

    setValidForm();


    component.submit();


    expect(
      employeeServiceMock.createEmployee
    ).toHaveBeenCalledWith({

      employeeCode: 'EMP001',

      firstName: 'John',

      lastName: 'Doe',

      email: 'john@example.com',

      country: 'India',

      currentSalary: 500000,

      currency: 'INR'

    });


    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([

      '/employees',

      1

    ]);

  });


  /*
   * ==================================================
   * CREATE ERROR
   * ==================================================
   */

  it('should handle create employee error', () => {

    setValidForm();


    employeeServiceMock.createEmployee.mockReturnValue(

      throwError(
        () => new Error('Create failed')
      )

    );


    component.submit();


    expect(
      employeeServiceMock.createEmployee
    ).toHaveBeenCalled();


    expect(
      component.error()
    ).toBe(true);


    expect(
      component.loading()
    ).toBe(false);

  });


  /*
   * ==================================================
   * EDIT MODE
   * ==================================================
   */

  it('should initialize edit mode and load employee', () => {

    /*
     * ngOnInit was already called in beforeEach()
     * with no ID, so explicitly simulate edit mode.
     */

    component.editMode.set(true);

    component['employeeId'] = 1;


    /*
     * Load employee manually.
     */

    component['loadEmployee'](1);


    expect(
      employeeServiceMock.getEmployee
    ).toHaveBeenCalledWith(1);


    expect(
      component.form.controls.employeeCode.value
    ).toBe('EMP001');


    expect(
      component.form.controls.firstName.value
    ).toBe('John');


    expect(
      component.form.controls.lastName.value
    ).toBe('Doe');


    expect(
      component.form.controls.email.value
    ).toBe('john@example.com');


    expect(
      component.form.controls.country.value
    ).toBe('India');


    expect(
      component.form.controls.currentSalary.value
    ).toBe(500000);


    expect(
      component.form.controls.currency.value
    ).toBe('INR');


    expect(
      component.editMode()
    ).toBe(true);


    expect(
      component['employeeId']
    ).toBe(1);

  });


  /*
   * ==================================================
   * EMPLOYEE UPDATE
   * ==================================================
   */

  it('should update an existing employee', () => {

    /*
     * Simulate edit mode.
     */

    component.editMode.set(true);

    component['employeeId'] = 1;


    /*
     * Important:
     *
     * original salary/currency are the values
     * loaded from the existing employee.
     */

    component['originalSalary'] = 500000;

    component['originalCurrency'] = 'INR';


    component.form.patchValue({

      employeeCode: 'EMP001',

      firstName: 'Jane',

      lastName: 'Doe',

      email: 'jane@example.com',

      country: 'India',

      currentSalary: 600000,

      currency: 'INR'

    });


    component.submit();


    /*
     * Employee API should receive only
     * employee information.
     */

    expect(
      employeeServiceMock.updateEmployee
    ).toHaveBeenCalledWith(

      1,

      {

        firstName: 'Jane',

        lastName: 'Doe',

        email: 'jane@example.com',

        country: 'India'

      }

    );


    /*
     * Salary changed, therefore Salary API
     * should also be called.
     */

    expect(
      salaryServiceMock.updateSalary
    ).toHaveBeenCalledWith(

      1,

      {

        salary: 600000,

        currency: 'INR',

        effectiveFrom:
          expect.any(String)

      }

    );


    /*
     * Finally navigate back to employee detail.
     */

    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([

      '/employees',

      1

    ]);

  });


  /*
   * ==================================================
   * EMPLOYEE UPDATE ERROR
   * ==================================================
   */

  it('should handle update employee error', () => {

    component.editMode.set(true);

    component['employeeId'] = 1;

    component['originalSalary'] = 500000;

    component['originalCurrency'] = 'INR';


    component.form.patchValue({

      employeeCode: 'EMP001',

      firstName: 'Jane',

      lastName: 'Doe',

      email: 'jane@example.com',

      country: 'India',

      currentSalary: 600000,

      currency: 'INR'

    });


    employeeServiceMock.updateEmployee.mockReturnValue(

      throwError(
        () => new Error('Update failed')
      )

    );


    component.submit();


    expect(
      employeeServiceMock.updateEmployee
    ).toHaveBeenCalled();


    expect(
      salaryServiceMock.updateSalary
    ).not.toHaveBeenCalled();


    expect(
      component.error()
    ).toBe(true);


    expect(
      component.loading()
    ).toBe(false);

  });


  /*
   * ==================================================
   * SALARY UPDATE ERROR
   * ==================================================
   */

  it('should handle salary update error', () => {

    component.editMode.set(true);

    component['employeeId'] = 1;

    component['originalSalary'] = 500000;

    component['originalCurrency'] = 'INR';


    component.form.patchValue({

      employeeCode: 'EMP001',

      firstName: 'Jane',

      lastName: 'Doe',

      email: 'jane@example.com',

      country: 'India',

      currentSalary: 600000,

      currency: 'INR'

    });


    salaryServiceMock.updateSalary.mockReturnValue(

      throwError(
        () => new Error('Salary update failed')
      )

    );


    component.submit();


    expect(
      employeeServiceMock.updateEmployee
    ).toHaveBeenCalled();


    expect(
      salaryServiceMock.updateSalary
    ).toHaveBeenCalledWith(

      1,

      {

        salary: 600000,

        currency: 'INR',

        effectiveFrom:
          expect.any(String)

      }

    );


    expect(
      component.error()
    ).toBe(true);


    expect(
      component.loading()
    ).toBe(false);

  });


  /*
   * ==================================================
   * NO SALARY CHANGE
   * ==================================================
   */

  it('should not update salary when salary information is unchanged', () => {

    component.editMode.set(true);

    component['employeeId'] = 1;

    component['originalSalary'] = 500000;

    component['originalCurrency'] = 'INR';


    component.form.patchValue({

      employeeCode: 'EMP001',

      firstName: 'Jane',

      lastName: 'Doe',

      email: 'jane@example.com',

      country: 'India',

      currentSalary: 500000,

      currency: 'INR'

    });


    component.submit();


    expect(
      employeeServiceMock.updateEmployee
    ).toHaveBeenCalledWith(

      1,

      {

        firstName: 'Jane',

        lastName: 'Doe',

        email: 'jane@example.com',

        country: 'India'

      }

    );


    expect(
      salaryServiceMock.updateSalary
    ).not.toHaveBeenCalled();


    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([

      '/employees',

      1

    ]);

  });


  /*
   * ==================================================
   * CANCEL
   * ==================================================
   */

  it('should navigate back to employees when cancel is clicked', () => {

    component.cancel();


    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([

      '/employees'

    ]);

  });


  it('should navigate back to employee when cancel is clicked in edit mode', () => {

    component.editMode.set(true);

    component['employeeId'] = 1;


    component.cancel();


    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([

      '/employees',

      1

    ]);

  });


  /*
   * ==================================================
   * CURRENCY LOADING ERROR
   * ==================================================
   */

  it('should handle currency loading error', () => {

    /*
     * Reset the currency service response.
     */

    currencyServiceMock.getSupportedCurrencies.mockReturnValue(

      throwError(
        () => new Error('Currency API failed')
      )

    );


    /*
     * Trigger currency loading again.
     */

    component['loadCurrencies']();


    expect(
      component.currencyLoading()
    ).toBe(false);


    expect(
      component.currencyError()
    ).toBe(true);


    expect(
      component.currencies()
    ).toEqual([]);

  });


  /*
   * ==================================================
   * INVALID FORM SHOULD NOT SUBMIT
   * ==================================================
   */

  it('should not submit when form is invalid', () => {

    component.form.reset();


    component.submit();


    expect(
      employeeServiceMock.createEmployee
    ).not.toHaveBeenCalled();


    expect(
      employeeServiceMock.updateEmployee
    ).not.toHaveBeenCalled();


    expect(
      salaryServiceMock.updateSalary
    ).not.toHaveBeenCalled();

  });

});