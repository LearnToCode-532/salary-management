import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SalaryHistory } from './salary-history';
import { SalaryService } from '../../../../core/services/salary.service';

describe('SalaryHistory', () => {

  let component: SalaryHistory;
  let fixture: ComponentFixture<SalaryHistory>;

  const salaryServiceMock = {
    getSalaryHistory: vi.fn()
  };

  const routeMock = {
    paramMap: of({
      get: (key: string) =>
        key === 'id' ? '1' : null
    })
  };

  const salaryHistoryResponse = {
    content: [
      {
        id: 1,
        employeeId: 1,
        salary: 500000,
        currency: 'INR',
        effectiveFrom: '2026-01-01'
      },
      {
        id: 2,
        employeeId: 1,
        salary: 600000,
        currency: 'INR',
        effectiveFrom: '2026-06-01'
      }
    ],
    totalElements: 2,
    totalPages: 1,
    number: 0,
    size: 20
  };

  beforeEach(async () => {

    salaryServiceMock.getSalaryHistory.mockReset();

    salaryServiceMock.getSalaryHistory.mockReturnValue(
      of(salaryHistoryResponse)
    );

    await TestBed.configureTestingModule({

      imports: [
        SalaryHistory
      ],

      providers: [

        {
          provide: SalaryService,
          useValue: salaryServiceMock
        },

        {
          provide: ActivatedRoute,
          useValue: routeMock
        }

      ]

    }).compileComponents();

    fixture =
      TestBed.createComponent(SalaryHistory);

    component =
      fixture.componentInstance;
  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });


  it('should load salary history on initialization', () => {

    fixture.detectChanges();

    expect(
      salaryServiceMock.getSalaryHistory
    ).toHaveBeenCalledWith(
      1,
      0,
      20
    );

    expect(
      component.employeeId()
    ).toBe(1);

    expect(
      component.salaryHistory().length
    ).toBe(2);

    expect(
      component.totalElements()
    ).toBe(2);

    expect(
      component.totalPages()
    ).toBe(1);

    expect(
      component.page()
    ).toBe(0);

    expect(
      component.loading()
    ).toBe(false);

  });


  it('should handle empty salary history', () => {

    salaryServiceMock.getSalaryHistory.mockReturnValue(
      of({
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 20
      })
    );

    fixture.detectChanges();

    expect(
      component.salaryHistory()
    ).toEqual([]);

    expect(
      component.totalElements()
    ).toBe(0);

    expect(
      component.totalPages()
    ).toBe(0);

    expect(
      component.loading()
    ).toBe(false);

  });


  it('should handle salary history loading error', () => {

    salaryServiceMock.getSalaryHistory.mockReturnValue(
      throwError(() =>
        new Error('Failed to load salary history')
      )
    );

    fixture.detectChanges();

    expect(
      component.salaryHistory()
    ).toEqual([]);

    expect(
      component.totalElements()
    ).toBe(0);

    expect(
      component.totalPages()
    ).toBe(0);

    expect(
      component.loading()
    ).toBe(false);

    expect(
      component.errorMessage()
    ).toBe(
      'Unable to load salary history.'
    );

  });


  it('should set error when employee ID is missing', async () => {

    const missingIdRoute = {
      paramMap: of({
        get: () => null
      })
    };

    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({

      imports: [
        SalaryHistory
      ],

      providers: [

        {
          provide: SalaryService,
          useValue: salaryServiceMock
        },

        {
          provide: ActivatedRoute,
          useValue: missingIdRoute
        }

      ]

    }).compileComponents();

    const missingIdFixture =
      TestBed.createComponent(SalaryHistory);

    const missingIdComponent =
      missingIdFixture.componentInstance;

    missingIdFixture.detectChanges();

    expect(
      salaryServiceMock.getSalaryHistory
    ).not.toHaveBeenCalled();

    expect(
      missingIdComponent.loading()
    ).toBe(false);

    expect(
      missingIdComponent.errorMessage()
    ).toBe(
      'Employee ID is missing.'
    );

  });


  it('should set error when employee ID is invalid', async () => {

    const invalidIdRoute = {
      paramMap: of({
        get: () => 'abc'
      })
    };

    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({

      imports: [
        SalaryHistory
      ],

      providers: [

        {
          provide: SalaryService,
          useValue: salaryServiceMock
        },

        {
          provide: ActivatedRoute,
          useValue: invalidIdRoute
        }

      ]

    }).compileComponents();

    const invalidIdFixture =
      TestBed.createComponent(SalaryHistory);

    const invalidIdComponent =
      invalidIdFixture.componentInstance;

    invalidIdFixture.detectChanges();

    expect(
      salaryServiceMock.getSalaryHistory
    ).not.toHaveBeenCalled();

    expect(
      invalidIdComponent.loading()
    ).toBe(false);

    expect(
      invalidIdComponent.errorMessage()
    ).toBe(
      'Invalid Employee ID.'
    );

  });


it('should move to the next page', () => {
  fixture.detectChanges();

  salaryServiceMock.getSalaryHistory.mockClear();

  component.page.set(0);
  component.totalPages.set(3);

  salaryServiceMock.getSalaryHistory.mockReturnValue(
    of({
      content: [],
      totalElements: 60,
      totalPages: 3,
      number: 1
    })
  );

  component.nextPage();

  expect(component.page()).toBe(1);

  expect(
    salaryServiceMock.getSalaryHistory
  ).toHaveBeenCalledWith(
    1,
    1,
    20
  );
});

  it('should not move beyond the last page', () => {

    fixture.detectChanges();

    salaryServiceMock.getSalaryHistory.mockClear();

    component.totalPages.set(3);
    component.page.set(2);

    component.nextPage();

    expect(
      component.page()
    ).toBe(2);

    expect(
      salaryServiceMock.getSalaryHistory
    ).not.toHaveBeenCalled();

  });


it('should move to the previous page', () => {
  fixture.detectChanges();

  salaryServiceMock.getSalaryHistory.mockClear();

  component.page.set(2);
  component.totalPages.set(3);

  salaryServiceMock.getSalaryHistory.mockReturnValue(
    of({
      content: [],
      totalElements: 60,
      totalPages: 3,
      number: 1
    })
  );

  component.previousPage();

  expect(component.page()).toBe(1);

  expect(
    salaryServiceMock.getSalaryHistory
  ).toHaveBeenCalledWith(
    1,
    1,
    20
  );
});


  it('should not move before the first page', () => {

    fixture.detectChanges();

    salaryServiceMock.getSalaryHistory.mockClear();

    component.page.set(0);

    component.previousPage();

    expect(
      component.page()
    ).toBe(0);

    expect(
      salaryServiceMock.getSalaryHistory
    ).not.toHaveBeenCalled();

  });


  it('should correctly report whether a previous page exists', () => {

    fixture.detectChanges();

    component.page.set(0);

    expect(
      component.hasPreviousPage
    ).toBe(false);

    component.page.set(1);

    expect(
      component.hasPreviousPage
    ).toBe(true);

  });


  it('should correctly report whether a next page exists', () => {

    fixture.detectChanges();

    component.page.set(0);
    component.totalPages.set(1);

    expect(
      component.hasNextPage
    ).toBe(false);

    component.totalPages.set(3);

    expect(
      component.hasNextPage
    ).toBe(true);

    component.page.set(2);

    expect(
      component.hasNextPage
    ).toBe(false);

  });

});