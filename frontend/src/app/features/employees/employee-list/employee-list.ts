import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../core/services/employee.service';
import { RouterLink } from '@angular/router';
import {
  Employee,
  EmployeePage
} from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeList implements OnInit {
  Math = Math;
  private readonly employeeService = inject(EmployeeService);

  readonly employees = signal<Employee[]>([]);
  readonly totalElements = signal(0);

  readonly loading = signal(true);
  readonly error = signal(false);
readonly page = signal(0);
readonly size = signal(20);
readonly totalPages = signal(0);
readonly search = signal('');
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
      this.search()
    )
    .subscribe({

      next: page => {

        this.employees.set(page.content);
        this.totalElements.set(page.totalElements);

        this.totalPages.set(
          Math.ceil(page.totalElements / this.size())
        );

        this.loading.set(false);
      },

      error: error => {

        console.error('Failed to load employees:', error);

        this.loading.set(false);
        this.error.set(true);
      }

    });
}
nextPage(): void {

  if (this.page() + 1 >= this.totalPages()) {
    return;
  }

  this.page.update(current => current + 1);
  this.loadEmployees();
}

previousPage(): void {

  if (this.page() === 0) {
    return;
  }

  this.page.update(current => current - 1);
  this.loadEmployees();
}
onSearch(): void {

  this.page.set(0);
  this.loadEmployees();
}
clearSearch(): void {

  this.search.set('');
  this.page.set(0);

  this.loadEmployees();
}
}