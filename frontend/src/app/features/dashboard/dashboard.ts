import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { BaseChartDirective } from 'ng2-charts';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import {
  AnalyticsService
} from '../../../core/services/analytics.service';

import {
  SalarySummary,
  CountrySalarySummary
} from '../../../core/models/analytics.model';

type CountrySortColumn =
  | 'country'
  | 'employeeCount'
  | 'totalSalary'
  | 'averageSalary'
  | 'medianSalary';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    BaseChartDirective
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private readonly analyticsService =
    inject(AnalyticsService);

  readonly summary =
    signal<SalarySummary | null>(null);

  readonly countrySummary =
    signal<CountrySalarySummary[]>([]);

  readonly loading =
    signal(true);

  readonly error =
    signal(false);

  readonly sortColumn =
    signal<CountrySortColumn>('country');

  readonly sortDirection =
    signal<SortDirection>('asc');


  /*
   * Employees by country chart
   */
  readonly employeeChartData =
    signal<ChartConfiguration<'bar'>['data']>({
      labels: [],
      datasets: [
        {
          label: 'Employees',
          data: []
        }
      ]
    });


  /*
   * Average salary by country chart
   */
  readonly averageSalaryChartData =
    signal<ChartConfiguration<'bar'>['data']>({
      labels: [],
      datasets: [
        {
          label: 'Average Salary (USD)',
          data: []
        }
      ]
    });


  readonly barChartOptions:
    ChartOptions<'bar'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: true
      }

    },

    scales: {

      x: {
        ticks: {
          autoSkip: false
        }
      },

      y: {
        beginAtZero: true
      }

    }

  };


  ngOnInit(): void {
    this.loadAnalytics();
  }


  private loadAnalytics(): void {

    this.loading.set(true);
    this.error.set(false);

    forkJoin({

      summary:
        this.analyticsService.getSummary(),

      countries:
        this.analyticsService.getCountrySummary()

    }).subscribe({
      next: result => {
        this.summary.set(
          result.summary
        );

        this.countrySummary.set(
          result.countries
        );

        this.buildCharts(
          result.countries
        );

        this.loading.set(false);

      },

      error: error => {

        console.error(
          'Failed to load analytics:',
          error
        );

        this.loading.set(false);
        this.error.set(true);

      }

    });

  }


  /*
   * Sort country table.
   */
  sortBy(
    column: CountrySortColumn
  ): void {

    if (this.sortColumn() === column) {

      this.sortDirection.set(
        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'
      );

    } else {

      this.sortColumn.set(column);
      this.sortDirection.set('asc');

    }

    const sorted =
      [...this.countrySummary()]
        .sort((a, b) =>
          this.compareCountries(a, b)
        );

    this.countrySummary.set(sorted);

  }


  /*
   * Compare two country records.
   */
  private compareCountries(
    a: CountrySalarySummary,
    b: CountrySalarySummary
  ): number {

    const column =
      this.sortColumn();

    const direction =
      this.sortDirection();

    let comparison = 0;

    if (column === 'country') {

      comparison =
        a.country.localeCompare(
          b.country
        );

    } else if (column === 'employeeCount') {

      comparison =
        a.employeeCount -
        b.employeeCount;

    } else if (column === 'totalSalary') {

      comparison =
        a.totalSalary -
        b.totalSalary;

    } else if (column === 'averageSalary') {

      comparison =
        a.averageSalary -
        b.averageSalary;

    } else if (column === 'medianSalary') {

      comparison =
        a.medianSalary -
        b.medianSalary;

    }

    return direction === 'asc'
      ? comparison
      : -comparison;
  }


  /*
   * Returns the sorted country data.
   */
  sortedCountries():
    CountrySalarySummary[] {

    return this.countrySummary();

  }


  /*
   * Return sort indicator.
   */
  sortIndicator(
    column: CountrySortColumn
  ): string {

    if (this.sortColumn() !== column) {
      return '';
    }

    return this.sortDirection() === 'asc'
      ? ' ↑'
      : ' ↓';

  }


  /*
   * Build dashboard charts.
   */
  private buildCharts(
    countries: CountrySalarySummary[]
  ): void {

    const labels =
      countries.map(
        country => country.country
      );


    this.employeeChartData.set({

      labels,

      datasets: [
        {
          label: 'Employees',

          data: countries.map(
            country =>
              country.employeeCount
          )
        }
      ]

    });


    this.averageSalaryChartData.set({

      labels,

      datasets: [
        {
          label: 'Average Salary (USD)',

          data: countries.map(
            country =>
              country.averageSalary
          )
        }
      ]

    });

  }

}