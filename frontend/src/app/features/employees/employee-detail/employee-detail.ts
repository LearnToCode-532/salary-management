import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss'
})
export class EmployeeDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);

  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.employeeService.getEmployee(id).subscribe({

      next: employee => {
        this.employee.set(employee);
        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Failed to load employee:',
          error
        );

        this.loading.set(false);
        this.error.set(true);
      }

    });
  }
}