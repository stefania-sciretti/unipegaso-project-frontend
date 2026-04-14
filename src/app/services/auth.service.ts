import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export type UserRole = 'admin' | 'user';
export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
}
const USERS: (AuthUser & { password: string })[] = [
  { username: 'admin',  password: 'password',  role: 'admin', displayName: 'Dott.ssa Simona Ruberti' },
  { username: 'paziente',        password: 'password',role: 'user',  displayName: 'Alessia Audace'},
];
const STORAGE_KEY = 'apice_auth_user';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user       = new BehaviorSubject<AuthUser | null>(this.loadFromStorage());
  private _showModal  = new BehaviorSubject<boolean>(false);
  readonly user$       = this._user.asObservable();
  readonly showModal$  = this._showModal.asObservable();
  get currentUser(): AuthUser | null { return this._user.getValue(); }
  get isLoggedIn(): boolean          { return this._user.getValue() !== null; }
  get isAdmin(): boolean             { return this._user.getValue()?.role === 'admin'; }
  openLoginModal(): void  { this._showModal.next(true);  }
  closeLoginModal(): void { this._showModal.next(false); }
  login(username: string, password: string): boolean {
    const found = USERS.find(
      u => u.username === username.trim().toLowerCase() && u.password === password
    );
    if (!found) return false;
    const user: AuthUser = { username: found.username, role: found.role, displayName: found.displayName };
    this._user.next(user);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._showModal.next(false);
    return true;
  }
  logout(): void {
    this._user.next(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }
  private loadFromStorage(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
