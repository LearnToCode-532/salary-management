import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SalaryService } from '../../../../core/services/salary.service';
import { SalaryHistoryResponse } from '../../../../core/models/salary.model';

@Component({
  selector: 'app-salary-history',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink
  ],
  templateUrl: './salary-history.html',
  styleUrl: './salary-history.scss'
})
export class SalaryHistory implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly salaryService = inject(SalaryService);

  employeeId = signal(0);

  salaryHistory = signal<SalaryHistoryResponse[]>([]);

  page = signal(0);
  pageSize = signal(20);

  totalElements = signal(0);
  totalPages = signal(0);

  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.loading.set(false);
        this.errorMessage.set(
          'Employee ID is missing.'
        );
        return;
      }

      const employeeId = Number(id);

      if (Number.isNaN(employeeId) || employeeId <= 0) {
        this.loading.set(false);
        this.errorMessage.set(
          'Invalid Employee ID.'
        );
        return;
      }

      this.employeeId.set(employeeId);
      this.loadSalaryHistory();
    });
  }

  loadSalaryHistory(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.salaryService
      .getSalaryHistory(
        this.employeeId(),
        this.page(),
        this.pageSize()
      )
      .subscribe({

        next: response => {

          this.salaryHistory.set(
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
          this.loading.set(false);
        },

        error: error => {

          this.salaryHistory.set([]);
          this.totalElements.set(0);
          this.totalPages.set(0);

          this.loading.set(false);

          this.errorMessage.set(
            'Unable to load salary history.'
          );
        },
        complete: () => {}
      });
  }

  previousPage(): void {

    if (!this.hasPreviousPage) {
      return;
    }

    this.page.update(
      currentPage => currentPage - 1
    );

    this.loadSalaryHistory();
  }

  nextPage(): void {

    if (!this.hasNextPage) {
      return;
    }

    this.page.update(
      currentPage => currentPage + 1
    );

    this.loadSalaryHistory();
  }

  get hasPreviousPage(): boolean {
    return this.page() > 0;
  }

  get hasNextPage(): boolean {
    return this.page() + 1 < this.totalPages();
  }
}
