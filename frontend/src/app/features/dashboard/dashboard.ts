import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { AnalyticsService } from '../../../core/services/analytics.service';
import {
  SalarySummary,
  CountrySalarySummary
} from '../../../core/models/analytics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private readonly analyticsService = inject(AnalyticsService);

  readonly summary = signal<SalarySummary | null>(null);
  readonly countrySummary = signal<CountrySalarySummary[]>([]);

  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {

    this.loading.set(true);
    this.error.set(false);

    forkJoin({
      summary: this.analyticsService.getSummary(),
      countries: this.analyticsService.getCountrySummary()
    }).subscribe({
      next: result => {

        console.log('Analytics result:', result);

        this.summary.set(result.summary);
        this.countrySummary.set(result.countries);

        this.loading.set(false);
      },

      error: error => {

        console.error('Failed to load analytics:', error);

        this.loading.set(false);
        this.error.set(true);
      }
    });
  }
}