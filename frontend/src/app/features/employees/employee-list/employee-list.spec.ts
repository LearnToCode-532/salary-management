import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeList } from './employee-list';
import { EmployeeService } from '../../../../core/services/employee.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EmployeeList', () => {

  let component: EmployeeList;
  let fixture: ComponentFixture<EmployeeList>;

  const employeeServiceMock = {
    getEmployees: vi.fn()
  };

  beforeEach(async () => {

    employeeServiceMock.getEmployees.mockReturnValue(
      of({
        content: [
          {
            id: 1,
            employeeCode: 'EMP001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            country: 'India',
            currentSalary: 500000,
            currency: 'INR'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0
      })
    );

    await TestBed.configureTestingModule({
      imports: [
        EmployeeList
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
                get: () => null
              }
            }
          }
        },

        provideRouter([])
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeList);
    component = fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });


  it('should load employees on initialization', () => {

    fixture.detectChanges();

    expect(
      employeeServiceMock.getEmployees
    ).toHaveBeenCalled();

    expect(
      component.employees().length
    ).toBe(1);

    expect(
      component.totalElements()
    ).toBe(1);

    expect(
      component.totalPages()
    ).toBe(1);

    expect(
      component.loading()
    ).toBe(false);

  });


  it('should handle employee loading error', () => {

    employeeServiceMock.getEmployees.mockReturnValue(
      throwError(() => new Error('API error'))
    );

    fixture.detectChanges();

    expect(
      component.loading()
    ).toBe(false);

    expect(
      component.error()
    ).toBe(true);

  });


  it('should not move before the first page', () => {

    fixture.detectChanges();

    expect(
      component.page()
    ).toBe(0);

    component.previousPage();

    expect(
      component.page()
    ).toBe(0);

  });


  it('should not move beyond the last page', () => {

    fixture.detectChanges();

    expect(
      component.page()
    ).toBe(0);

    component.nextPage();

    expect(
      component.page()
    ).toBe(0);

  });


  it('should reset page when searching', () => {

    fixture.detectChanges();

    component.page.set(2);
    component.pageInput = 3;
    component.search.set('John');

    component.onSearch();

    expect(
      component.page()
    ).toBe(0);

    expect(
      component.pageInput
    ).toBe(1);

  });


  it('should clear search and reset page', () => {

    fixture.detectChanges();

    component.page.set(2);
    component.pageInput = 3;
    component.search.set('John');

    component.clearSearch();

    expect(
      component.search()
    ).toBe('');

    expect(
      component.page()
    ).toBe(0);

    expect(
      component.pageInput
    ).toBe(1);

  });


  it('should change sort direction when sorting the same column', () => {

    fixture.detectChanges();

    expect(
      component.sortColumn()
    ).toBe('employeeCode');

    expect(
      component.sortDirection()
    ).toBe('asc');

    component.sortBy('employeeCode');

    expect(
      component.sortDirection()
    ).toBe('desc');

    component.sortBy('employeeCode');

    expect(
      component.sortDirection()
    ).toBe('asc');

  });


  it('should select a new sort column', () => {

    fixture.detectChanges();

    component.sortBy('country');

    expect(
      component.sortColumn()
    ).toBe('country');

    expect(
      component.sortDirection()
    ).toBe('asc');

    expect(
      component.page()
    ).toBe(0);

  });


  it('should return correct sort indicator', () => {

    fixture.detectChanges();

    expect(
      component.sortIndicator('employeeCode')
    ).toBe('↑');

    component.sortBy('employeeCode');

    expect(
      component.sortIndicator('employeeCode')
    ).toBe('↓');

    expect(
      component.sortIndicator('country')
    ).toBe('');

  });


  it('should navigate directly to a valid page', () => {

  employeeServiceMock.getEmployees
    .mockReturnValueOnce(
      of({
        content: [],
        totalElements: 100,
        totalPages: 5,
        number: 0
      })
    )
    .mockReturnValueOnce(
      of({
        content: [],
        totalElements: 100,
        totalPages: 5,
        number: 2
      })
    );

  fixture.detectChanges();

  component.pageInput = 3;

  component.goToPage();

  expect(
    component.page()
  ).toBe(2);

  expect(
    component.pageInput
  ).toBe(3);

});


  it('should reject an invalid page number', () => {

    fixture.detectChanges();

    component.page.set(2);
    component.pageInput = 999;

    component.goToPage();

    expect(
      component.page()
    ).toBe(2);

    expect(
      component.pageInput
    ).toBe(3);

  });

});