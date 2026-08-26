import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Dashboard
} from './dashboard';

import {
  AnalyticsService
} from '../../../core/services/analytics.service';

import {
  SalarySummary,
  CountrySalarySummary
} from '../../../core/models/analytics.model';

import {
  of,
  throwError
} from 'rxjs';

import { vi } from 'vitest';


describe('Dashboard', () => {

  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;

  const analyticsServiceMock = {

    getSummary: vi.fn(),

    getCountrySummary: vi.fn()

  };


  const summary: SalarySummary = {
    employeeCount: 3,
    totalSalary: 1500000,
    averageSalary: 500000,
    medianSalary: 450000,
    reportingCurrency: "USD"

  };


  const countries: CountrySalarySummary[] = [

    {
      country: 'India',
      employeeCount: 10,
      totalSalary: 5000000,
      averageSalary: 500000,
      medianSalary: 450000,
      reportingCurrency: "INR"
    },

    {
      country: 'USA',
      employeeCount: 5,
      totalSalary: 4000000,
      averageSalary: 800000,
      medianSalary: 750000,
      reportingCurrency: "USD"
    },

    {
      country: 'Canada',
      employeeCount: 8,
      totalSalary: 3600000,
      averageSalary: 450000,
      medianSalary: 400000,
      reportingCurrency: "USD"
    }

  ];


  beforeEach(async () => {

    analyticsServiceMock.getSummary.mockReset();

    analyticsServiceMock.getCountrySummary.mockReset();


    analyticsServiceMock.getSummary.mockReturnValue(
      of(summary)
    );


    analyticsServiceMock.getCountrySummary.mockReturnValue(
      of(countries)
    );


    await TestBed.configureTestingModule({

      imports: [
        Dashboard
      ],

      providers: [

        {
          provide: AnalyticsService,

          useValue: analyticsServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(Dashboard);

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });


  it('should load analytics on initialization', () => {

    fixture.detectChanges();


    expect(
      analyticsServiceMock.getSummary
    ).toHaveBeenCalledTimes(1);


    expect(
      analyticsServiceMock.getCountrySummary
    ).toHaveBeenCalledTimes(1);

  });


  it('should populate summary after loading analytics', () => {

    fixture.detectChanges();


    expect(
      component.summary()
    ).toEqual(summary);

  });


  it('should populate country summary after loading analytics', () => {

    fixture.detectChanges();


    expect(
      component.countrySummary()
    ).toEqual(countries);

  });


  it('should set loading to false after analytics load succeeds', () => {

    fixture.detectChanges();


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(false);

  });


  it('should build employee chart data', () => {

    fixture.detectChanges();


    expect(
      component.employeeChartData().labels
    ).toEqual([
      'India',
      'USA',
      'Canada'
    ]);


    expect(
      component.employeeChartData().datasets[0].label
    ).toBe('Employees');


    expect(
      component.employeeChartData().datasets[0].data
    ).toEqual([
      10,
      5,
      8
    ]);

  });


  it('should build average salary chart data', () => {

    fixture.detectChanges();


    expect(
      component.averageSalaryChartData().labels
    ).toEqual([
      'India',
      'USA',
      'Canada'
    ]);


    expect(
      component.averageSalaryChartData().datasets[0].label
    ).toBe(
      'Average Salary (USD)'
    );


    expect(
      component.averageSalaryChartData().datasets[0].data
    ).toEqual([
      500000,
      800000,
      450000
    ]);

  });


  it('should handle analytics loading error', () => {

    analyticsServiceMock.getSummary.mockReturnValue(
      throwError(
        () => new Error('Analytics failed')
      )
    );


    fixture.detectChanges();


    expect(
      component.loading()
    ).toBe(false);


    expect(
      component.error()
    ).toBe(true);

  });


  it('should sort by country ascending and descending', () => {

    fixture.detectChanges();


    component.sortBy('country');


    expect(
      component.sortDirection()
    ).toBe('desc');


    expect(
      component.countrySummary().map(
        country => country.country
      )
    ).toEqual([
      'USA',
      'India',
      'Canada'
    ]);


    component.sortBy('country');


    expect(
      component.sortDirection()
    ).toBe('asc');


    expect(
      component.countrySummary().map(
        country => country.country
      )
    ).toEqual([
      'Canada',
      'India',
      'USA'
    ]);

  });


  it('should select a new sort column and default to ascending', () => {

    fixture.detectChanges();


    component.sortBy('employeeCount');


    expect(
      component.sortColumn()
    ).toBe('employeeCount');


    expect(
      component.sortDirection()
    ).toBe('asc');


    expect(
      component.countrySummary().map(
        country => country.employeeCount
      )
    ).toEqual([
      5,
      8,
      10
    ]);

  });


  it('should sort by total salary', () => {

    fixture.detectChanges();


    component.sortBy('totalSalary');


    expect(
      component.countrySummary().map(
        country => country.totalSalary
      )
    ).toEqual([
      3600000,
      4000000,
      5000000
    ]);

  });


  it('should sort by average salary', () => {

    fixture.detectChanges();


    component.sortBy('averageSalary');


    expect(
      component.countrySummary().map(
        country => country.averageSalary
      )
    ).toEqual([
      450000,
      500000,
      800000
    ]);

  });


  it('should sort by median salary', () => {

    fixture.detectChanges();


    component.sortBy('medianSalary');


    expect(
      component.countrySummary().map(
        country => country.medianSalary
      )
    ).toEqual([
      400000,
      450000,
      750000
    ]);

  });


  it('should return correct sort indicator', () => {

    fixture.detectChanges();


    expect(
      component.sortIndicator('country')
    ).toBe(' ↑');


    expect(
      component.sortIndicator('employeeCount')
    ).toBe('');


    component.sortBy('country');


    expect(
      component.sortIndicator('country')
    ).toBe(' ↓');


    expect(
      component.sortIndicator('employeeCount')
    ).toBe('');

  });


  it('should return sorted countries', () => {

    fixture.detectChanges();


    component.sortBy('country');


    expect(
      component.sortedCountries()
    ).toEqual(
      component.countrySummary()
    );

  });

});