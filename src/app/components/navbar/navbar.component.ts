import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styles: [`
    .nav-link { color: rgba(255,255,255,0.82); transition: background 0.15s, color 0.15s; cursor: pointer; }
    .nav-link:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .active-link { background: rgba(255,255,255,0.15); color: #fff; }
    .dropdown-toggle { color: rgba(255,255,255,0.82); cursor: pointer; }
    .dropdown-toggle.active-link { background: rgba(255,255,255,0.15); color: #fff; border-radius: 6px 6px 0 0; }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  activeMenu: string | null = null;
  showLoginModal = false;
  loginError = '';
  loginForm!: FormGroup;
  private sub!: Subscription;
  constructor(
    private router: Router,
    public auth: AuthService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.sub = this.auth.showModal$.subscribe(v => {
      this.showLoginModal = v;
      if (v) this.loginError = '';
    });
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); }
  toggle(menu: string, e: MouseEvent): void {
    e.stopPropagation();
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }
  go(path: string): void {
    this.router.navigate([path]);
    this.activeMenu = null;
  }
  openLogin(): void  { this.auth.openLoginModal(); this.activeMenu = null; }
  closeLogin(): void { this.auth.closeLoginModal(); this.loginForm.reset(); this.loginError = ''; }
  submitLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    const { username, password } = this.loginForm.value;
    const ok = this.auth.login(username, password);
    if (!ok) this.loginError = 'Credenziali non valide. Riprova.';
  }
  logout(): void { this.auth.logout(); this.activeMenu = null; }
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('app-navbar')) this.activeMenu = null;
  }
  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '?');
  }
  isSection(paths: string[]): boolean {
    return paths.some(p => this.router.url.startsWith(p));
  }
  isInvalid(field: string): boolean {
    const c = this.loginForm.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
