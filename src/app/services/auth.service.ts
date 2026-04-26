import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppointmentService} from './appointment.service';
import {ClinicalAppointmentService} from './clinical-appointment.service';

export type UserRole = 'admin' | 'user';
export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  displayName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  role: string;   // es. ROLE_ADMIN | ROLE_USER
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

const STORAGE_KEY = 'apice_auth_user';
const TOKEN_STORAGE_KEY = 'apice_auth_token';
const API_URL = '/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user       = new BehaviorSubject<AuthUser | null>(this.loadUserFromStorage());
  private _showModal  = new BehaviorSubject<boolean>(false);
  readonly user$       = this._user.asObservable();
  readonly showModal$  = this._showModal.asObservable();

  get currentUser(): AuthUser | null { return this._user.getValue(); }
  get isLoggedIn(): boolean          { return this._user.getValue() !== null; }
  get isAdmin(): boolean             { return this._user.getValue()?.role === 'admin'; }

  constructor(
    private http: HttpClient,
  ) {}

  openLoginModal(): void  { this._showModal.next(true);  }
  closeLoginModal(): void { this._showModal.next(false); }

  /**
   * Registra un nuovo utente
   */
  register(username: string, password: string, email?: string): Observable<any> {
    const request: RegisterRequest = {
      username: username.trim().toLowerCase(),
      password,
      email
    };
    return this.http.post(`${API_URL}/register`, request);
  }

  /**
   * Effettua il login e salva il token JWT
   */
  login(username: string, password: string): Observable<boolean> {
    const request: LoginRequest = {
      username: username.trim().toLowerCase(),
      password
    };

    return this.http.post<LoginResponse>(`${API_URL}/login`, request).pipe(
      map(response => {
        if (response && response.accessToken) {
          // Salva il token
          localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);

          // Determina il ruolo dall'autorità restituita dal server
          const role: UserRole = response.role === 'ROLE_ADMIN' ? 'admin' : 'user';

          // Crea l'utente e salvalo
          const user: AuthUser = {
            id: Date.now(),
            username: response.username,
            role,
            displayName: response.username
          };

          this._user.next(user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          this._showModal.next(false);

          return true;
        }
        return false;
      })
    );
  }

  /**
   * Effettua il logout
   */
  logout(): void {
    this._user.next(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Ottiene il token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Valida il token JWT
   */
  validateToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    return this.http.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  /**
   * Carica l'utente dal localStorage
   */
  private loadUserFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}



