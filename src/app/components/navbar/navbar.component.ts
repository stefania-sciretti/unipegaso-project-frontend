import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styles: [`
    .nav-link { color: rgba(255,255,255,0.82); transition: background 0.15s, color 0.15s; }
    .nav-link:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .active-link { background: rgba(255,255,255,0.15); color: #fff; }
    .dropdown-toggle { color: rgba(255,255,255,0.82); }
    .dropdown-toggle.active-link { background: rgba(255,255,255,0.15); color: #fff; border-radius: 6px 6px 0 0; }
  `]
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
