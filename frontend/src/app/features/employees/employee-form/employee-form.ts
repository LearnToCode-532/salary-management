import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss'
})
export class EmployeeForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  readonly editMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal(false);

  private employeeId: number | null = null;

  readonly form = this.fb.nonNullable.group({

    employeeCode: [
      '',
      [
        Validators.required
      ]
    ],

    firstName: [
      '',
      [
        Validators.required
      ]
    ],

    lastName: [
      '',
      [
        Validators.required
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    country: [
      '',
      [
        Validators.required
      ]
    ],

    currentSalary: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    currency: [
      '',
      [
        Validators.required
      ]
    ]

  });

  ngOnInit(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    if (idParam) {

      this.editMode.set(true);
      this.employeeId = Number(idParam);

      this.loadEmployee(this.employeeId);

    }

  }

  private loadEmployee(id: number): void {

    this.loading.set(true);

    this.employeeService.getEmployee(id).subscribe({

      next: employee => {

        this.form.patchValue({
          employeeCode: employee.employeeCode,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          country: employee.country,
          currentSalary: employee.currentSalary,
          currency: employee.currency
        });

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

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.loading.set(true);
    this.error.set(false);

    const value = this.form.getRawValue();

    if (this.editMode() && this.employeeId !== null) {

      this.employeeService
        .updateEmployee(
          this.employeeId,
          {
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            country: value.country,
            currentSalary: value.currentSalary,
            currency: value.currency
          }
        )
        .subscribe({

          next: employee => {

            this.router.navigate([
              '/employees',
              employee.id
            ]);

          },

          error: error => {

            console.error(
              'Failed to update employee:',
              error
            );

            this.loading.set(false);
            this.error.set(true);

          }

        });

    } else {

      this.employeeService
        .createEmployee(value)
        .subscribe({

          next: employee => {

            this.router.navigate([
              '/employees',
              employee.id
            ]);

          },

          error: error => {

            console.error(
              'Failed to create employee:',
              error
            );

            this.loading.set(false);
            this.error.set(true);

          }

        });

    }

  }

  cancel(): void {

    this.router.navigate(['/employees']);

  }

}