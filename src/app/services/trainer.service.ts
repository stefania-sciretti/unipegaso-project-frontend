import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trainer } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private readonly base = '/api/trainers';
  constructor(private http: HttpClient) {}

  getAll(role?: string): Observable<Trainer[]> {
    const params = role ? new HttpParams().set('role', role) : undefined;
    return this.http.get<Trainer[]>(this.base, { params });
  }

  getById(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.base}/${id}`);
  }
}
