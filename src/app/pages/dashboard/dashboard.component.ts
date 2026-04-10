import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  constructor(private dashboardSvc: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.dashboardSvc.getStats().subscribe({
      next: (s) => { this.stats = s; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Failed to load stats'; this.loading = false; }
    });
  }

  navigate(path: string): void { this.router.navigate([path]); }
}
