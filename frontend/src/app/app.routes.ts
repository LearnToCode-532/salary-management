import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'employees',
    loadComponent: () =>
      import('./features/employees/employee-list/employee-list')
        .then(m => m.EmployeeList)
  },

  {
    path: 'employees/new',
    loadComponent: () =>
      import('./features/employees/employee-form/employee-form')
        .then(m => m.EmployeeForm)
  },

  {
    path: 'employees/:id/edit',
    loadComponent: () =>
      import('./features/employees/employee-form/employee-form')
        .then(m => m.EmployeeForm)
  },

  {
    path: 'employees/:id/salary-history',
    loadComponent: () =>
      import('./features/salary/salary-history/salary-history')
        .then(m => m.SalaryHistory)
  },

  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./features/employees/employee-detail/employee-detail')
        .then(m => m.EmployeeDetail)
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];