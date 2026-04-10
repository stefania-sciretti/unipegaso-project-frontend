import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand" (click)="go('/dashboard')" style="cursor:pointer">
        <span class="logo-icon">🏋️</span>
        CentroFitness Simona &amp; Luca
      </div>
      <ul class="navbar-links">
        <li><a (click)="go('/dashboard')"    [class.active-link]="isActive('/dashboard')">🏠 Home</a></li>
        <li><a (click)="go('/clients')"      [class.active-link]="isActive('/clients')">👥 Clienti</a></li>
        <li><a (click)="go('/appointments')" [class.active-link]="isActive('/appointments')">📅 Appuntamenti</a></li>
        <li class="divider"></li>
        <li><a (click)="go('/nutrition')"    [class.active-link]="isActive('/nutrition')">🥗 Simona</a></li>
        <li><a (click)="go('/recipes')"      [class.active-link]="isActive('/recipes')">🍽️ Ricette</a></li>
        <li class="divider"></li>
        <li><a (click)="go('/training')"     [class.active-link]="isActive('/training')">💪 Luca</a></li>
      </ul>
    </nav>
  `
})
export class NavbarComponent {
  constructor(private router: Router) {}

  go(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '?');
  }
}
