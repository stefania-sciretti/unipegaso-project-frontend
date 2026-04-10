import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly base = '/api/clients';
  constructor(private http: HttpClient) {}

  getAll(search = ''): Observable<Client[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Client[]>(this.base, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.base}/${id}`);
  }

  create(body: ClientRequest): Observable<Client> {
    return this.http.post<Client>(this.base, body);
  }

  update(id: number, body: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
