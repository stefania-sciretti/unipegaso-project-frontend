import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<any[]> { return this.http.get<any[]>('/api/trainers'); }
}
