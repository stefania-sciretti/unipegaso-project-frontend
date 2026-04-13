import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand" (click)="go('/dashboard')" style="cursor:pointer">
        <span class="material-icons navbar-brand-icon">local_hospital</span>
        Apice Clinic
      </div>
      <ul class="navbar-links">

        <li class="dropdown" [class.dropdown-open]="activeMenu==='clinico'">
          <a class="dropdown-toggle" [class.active-link]="isSection(['/patients','/doctors','/appointments','/reports','/services'])" (click)="toggle('clinico', $event)">
            <span class="material-icons nav-icon">medical_services</span> Clinico ▾
          </a>
          <ul class="dropdown-menu">
            <li><a (click)="go('/patients')"><span class="material-icons nav-icon">people</span> Pazienti</a></li>
            <li><a (click)="go('/doctors')"><span class="material-icons nav-icon">badge</span> Medici</a></li>
            <li><a (click)="go('/appointments')"><span class="material-icons nav-icon">calendar_today</span> Visite</a></li>
            <li><a (click)="go('/reports')"><span class="material-icons nav-icon">assignment</span> Referti</a></li>
            <li class="dropdown-divider"></li>
            <li><a (click)="go('/services')"><span class="material-icons nav-icon">list_alt</span> Elenco Prestazioni</a></li>
          </ul>
        </li>

        <li class="dropdown" [class.dropdown-open]="activeMenu==='nutrizione'">
          <a class="dropdown-toggle" [class.active-link]="isSection(['/clients','/nutrition','/recipes','/glycemia'])" (click)="toggle('nutrizione', $event)">
            <span class="material-icons nav-icon">restaurant_menu</span> Nutrizione ▾
          </a>
          <ul class="dropdown-menu">
            <li><a (click)="go('/clients')"><span class="material-icons nav-icon">group</span> Clienti</a></li>
            <li><a (click)="go('/nutrition')"><span class="material-icons nav-icon">restaurant_menu</span> Piani Dieta</a></li>
            <li><a (click)="go('/recipes')"><span class="material-icons nav-icon">menu_book</span> Ricette</a></li>
            <li><a (click)="go('/glycemia')"><span class="material-icons nav-icon">colorize</span> Glicemia</a></li>
          </ul>
        </li>

        <li><a (click)="go('/training')" [class.active-link]="isActive('/training')">
          <span class="material-icons nav-icon">fitness_center</span> Sport
        </a></li>

      </ul>
    </nav>
  `
})
export class NavbarComponent {
  activeMenu: string | null = null;

  constructor(private router: Router) {}

  toggle(menu: string, e: MouseEvent): void {
    e.stopPropagation();
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  go(path: string): void {
    this.router.navigate([path]);
    this.activeMenu = null;
  }

  // Chiude il menu cliccando fuori dalla navbar
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('app-navbar')) {
      this.activeMenu = null;
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '?');
  }

  isSection(paths: string[]): boolean {
    return paths.some(p => this.router.url.startsWith(p));
  }
}
