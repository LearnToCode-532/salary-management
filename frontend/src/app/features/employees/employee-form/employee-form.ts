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

import {
  EmployeeService
} from '../../../../core/services/employee.service';

import {
  SalaryService
} from '../../../../core/services/salary.service';

import {
  CurrencyService
} from '../../../../core/services/currency.service';

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

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly employeeService =
    inject(EmployeeService);

  private readonly salaryService =
    inject(SalaryService);

  private readonly currencyService =
    inject(CurrencyService);

  readonly editMode =
    signal(false);

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  readonly currencies =
    signal<string[]>([]);

  readonly currencyLoading =
    signal(true);

  readonly currencyError =
    signal(false);

  private employeeId: number | null = null;

  private originalSalary = 0;

  private originalCurrency = '';

  readonly form =
    this.fb.nonNullable.group({

      employeeCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ]
      ],

      country: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
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
        {
          value:'',
          disabled: true
        },
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{3}$/)
        ]
      ]
    });

  ngOnInit(): void {

    this.loadCurrencies();

    const idParam =
      this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id =
      Number(idParam);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.error.set(true);
      return;
    }

    this.editMode.set(true);
    this.employeeId = id;

    this.loadEmployee(id);
  }

  private loadCurrencies(): void {

    this.currencyLoading.set(true);
    this.currencyError.set(false);

    this.currencyService
      .getSupportedCurrencies()
      .subscribe({

        next: currencies => {

          this.currencies.set(currencies);

          this.currencyLoading.set(false);
          this.form.controls.currency.enable();
        },

        error: error => {

          console.error(
            'Failed to load supported currencies:',
            error
          );

          this.currencies.set([]);
          this.currencyLoading.set(false);
          this.currencyError.set(true);
        }

      });
  }

  private loadEmployee(
    id: number
  ): void {

    this.loading.set(true);
    this.error.set(false);

    this.employeeService
      .getEmployee(id)
      .subscribe({

        next: employee => {

          this.form.patchValue({

            employeeCode:
              employee.employeeCode,

            firstName:
              employee.firstName,

            lastName:
              employee.lastName,

            email:
              employee.email,

            country:
              employee.country,

            currentSalary:
              employee.currentSalary,

            currency:
              employee.currency
          });

          this.originalSalary =
            employee.currentSalary;

          this.originalCurrency =
            employee.currency;

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

    /*
     * Do not allow employee creation/update
     * when supported currencies could not be loaded.
     */
    if (
      this.currencyLoading() ||
      this.currencyError() ||
      this.currencies().length === 0
    ) {
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    const value =
      this.form.getRawValue();

    if (!this.editMode()) {

      this.createEmployee(value);

      return;
    }

    if (this.employeeId === null) {

      this.loading.set(false);
      this.error.set(true);

      return;
    }

    this.updateEmployee(
      this.employeeId,
      value
    );
  }

  private createEmployee(
    value: ReturnType<
      typeof this.form.getRawValue
    >
  ): void {

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

  private updateEmployee(
    employeeId: number,
    value: ReturnType<
      typeof this.form.getRawValue
    >
  ): void {

    /*
     * Employee information is updated
     * through the Employee API.
     *
     * Salary is handled separately by
     * the Salary API.
     */
    this.employeeService
      .updateEmployee(
        employeeId,
        {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          country: value.country
        }
      )
      .subscribe({

        next: () => {

          const salaryChanged =
            value.currentSalary !==
              this.originalSalary ||
            value.currency !==
              this.originalCurrency;

          if (!salaryChanged) {

            this.navigateToEmployee(
              employeeId
            );

            return;
          }

          this.updateSalary(
            employeeId,
            value.currentSalary,
            value.currency
          );
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
  }

  private updateSalary(
    employeeId: number,
    salary: number,
    currency: string
  ): void {

    this.salaryService
      .updateSalary(
        employeeId,
        {
          salary,
          currency,
          effectiveFrom:
            this.getToday()
        }
      )
      .subscribe({

        next: () => {

          this.navigateToEmployee(
            employeeId
          );
        },

        error: error => {

          console.error(
            'Failed to update salary:',
            error
          );

          this.loading.set(false);
          this.error.set(true);
        }

      });
  }

  private getToday(): string {

    return new Date()
      .toISOString()
      .split('T')[0];
  }

  private navigateToEmployee(
    employeeId: number
  ): void {

    this.router.navigate([
      '/employees',
      employeeId
    ]);
  }

  cancel(): void {

    if (this.employeeId !== null) {

      this.router.navigate([
        '/employees',
        this.employeeId
      ]);

      return;
    }

    this.router.navigate([
      '/employees'
    ]);
  }
}