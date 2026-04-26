import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
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
  loginLoading = false;
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
  // Use async navigation and handle the returned Promise to avoid ignored-promise warnings
  async go(path: string): Promise<void> {
    try {
      const navigated = await this.router.navigate([path]);
      if (!navigated) {
        // navigation returned false (didn't succeed)
        console.warn('Navigation to', path, 'did not complete successfully');
      }
    } catch (err) {
      // Log unexpected navigation errors
      console.error('Navigation error to', path, err);
    } finally {
      // Close any open menu regardless of navigation outcome
      this.activeMenu = null;
    }
  }
  openLogin(): void  { this.auth.openLoginModal(); this.activeMenu = null; }
  closeLogin(): void { this.auth.closeLoginModal(); this.loginForm.reset(); this.loginError = ''; }
  submitLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    const { username, password } = this.loginForm.value;
    this.loginLoading = true;
    this.loginError = '';
    this.auth.login(username, password).subscribe({
      next: (ok) => {
        this.loginLoading = false;
        if (!ok) this.loginError = 'Credenziali non valide. Riprova.';
      },
      error: () => {
        this.loginLoading = false;
        this.loginError = 'Credenziali non valide. Riprova.';
      }
    });
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
