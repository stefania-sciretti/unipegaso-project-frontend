import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlycemiaMeasurement, GlycemiaMeasurementRequest} from '../models/models';

@Injectable({ providedIn: 'root' })
export class GlycemiaService {
  private readonly base = '/api/glycemia-measurements';
  constructor(private http: HttpClient) {}
  getAll(clientId?: number): Observable<GlycemiaMeasurement[]> {
    const params = clientId ? new HttpParams().set('clientId', clientId) : undefined;
    return this.http.get<GlycemiaMeasurement[]>(this.base, { params });
  }
  getById(id: number): Observable<GlycemiaMeasurement> {
    return this.http.get<GlycemiaMeasurement>(`${this.base}/${id}`);
  }
  create(body: GlycemiaMeasurementRequest): Observable<GlycemiaMeasurement> {
    return this.http.post<GlycemiaMeasurement>(this.base, body);
  }
  update(id: number, body: GlycemiaMeasurementRequest): Observable<GlycemiaMeasurement> {
    return this.http.put<GlycemiaMeasurement>(`${this.base}/${id}`, body);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
