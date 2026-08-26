import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../core/services/employee.service';
import { RouterLink } from '@angular/router';

import {
  Employee
} from '../../../../core/models/employee.model';

type EmployeeSortColumn =
  | 'employeeCode'
  | 'firstName'
  | 'email'
  | 'country'
  | 'currentSalary'
  | 'currency';

type SortDirection =
  | 'asc'
  | 'desc';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeList implements OnInit {

  Math = Math;

  private readonly employeeService =
    inject(EmployeeService);


  readonly employees =
    signal<Employee[]>([]);

  readonly totalElements =
    signal(0);

  readonly loading =
    signal(true);

  readonly error =
    signal(false);

  readonly page =
    signal(0);

  readonly size =
    signal(20);

  readonly totalPages =
    signal(0);

  readonly search =
    signal('');


  readonly sortColumn =
    signal<EmployeeSortColumn>(
      'employeeCode'
    );

  readonly sortDirection =
    signal<SortDirection>('asc');


  /*
   * Used by the page-number input.
   *
   * UI displays 1-based page number,
   * while backend uses 0-based page number.
   */
  pageInput = 1;


  ngOnInit(): void {

    this.loadEmployees();

  }


  private loadEmployees(): void {

    this.loading.set(true);
    this.error.set(false);

    this.employeeService
      .getEmployees(
        this.page(),
        this.size(),
        this.search(),
        this.sortColumn(),
        this.sortDirection()
      )
      .subscribe({

        next: response => {

          this.employees.set(
            response.content ?? []
          );

          this.totalElements.set(
            response.totalElements ?? 0
          );

          this.totalPages.set(
            response.totalPages ?? 0
          );

          this.page.set(
            response.number ?? 0
          );

          /*
           * Keep input synchronized with
           * backend page number.
           */
          this.pageInput =
            response.number + 1;

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'Failed to load employees:',
            error
          );

          this.loading.set(false);
          this.error.set(true);

        }

      });

  }


  /*
   * Sorting
   */
  sortBy(
    column: EmployeeSortColumn
  ): void {

    if (
      this.sortColumn() === column
    ) {

      this.sortDirection.set(
        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'
      );

    } else {

      this.sortColumn.set(column);
      this.sortDirection.set('asc');

    }

    this.page.set(0);
    this.pageInput = 1;

    this.loadEmployees();

  }


  sortIndicator(
    column: EmployeeSortColumn
  ): string {

    if (
      this.sortColumn() !== column
    ) {

      return '';

    }

    return this.sortDirection() === 'asc'
      ? '↑'
      : '↓';

  }


  /*
   * Previous page
   */
  previousPage(): void {

    if (this.page() === 0) {
      return;
    }

    this.page.update(
      current => current - 1
    );

    this.loadEmployees();

  }


  /*
   * Next page
   */
  nextPage(): void {

    if (
      this.page() + 1 >=
      this.totalPages()
    ) {
      return;
    }

    this.page.update(
      current => current + 1
    );

    this.loadEmployees();

  }


  /*
   * Direct page navigation.
   *
   * User enters a 1-based page number.
   */
  goToPage(): void {

    const requestedPage =
      Number(this.pageInput);

    const totalPages =
      this.totalPages();

    if (
      !Number.isInteger(requestedPage) ||
      requestedPage < 1 ||
      requestedPage > totalPages
    ) {

      /*
       * Restore current valid page
       * if invalid input was entered.
       */
      this.pageInput =
        this.page() + 1;

      return;

    }

    const backendPage =
      requestedPage - 1;

    if (
      backendPage === this.page()
    ) {

      return;

    }

    this.page.set(backendPage);

    this.loadEmployees();

  }


  /*
   * Search
   */
  onSearch(): void {

    this.page.set(0);
    this.pageInput = 1;

    this.loadEmployees();

  }


  /*
   * Clear search
   */
  clearSearch(): void {

    this.search.set('');

    this.page.set(0);
    this.pageInput = 1;

    this.loadEmployees();

  }

}