import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class CalculatorsService {
  private baseUrl = environment.apiUrl + '/calculators';

  constructor(private http: HttpClient) {}

  exerciseWeapons(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?calculator=exercise-weapons`, data);
  }

  stamina(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?calculator=stamina`, data);
  }

  charmDamage(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?calculator=charm-damage`, data);
  }

  lootSplit(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?calculator=loot-split`, data);
  }
} 