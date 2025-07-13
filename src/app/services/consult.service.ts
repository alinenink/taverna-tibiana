// achievements.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { AuthService } from './auth.service';

// achievement.model.ts
export interface Achievement {
  name: string;
  id: string;
  secret: string;
  grade: string;
  points: string;
  description: string;
  spoiler: string;
}

export interface Outfit {
  addon1: false;
  addon2: false;
  base: false;
  id: { male: number; female: number };
  image: '';
  name: '';
  value: number;
}

export interface Mount {
  name: string;
  image: string;
  tamingMethod: string;
  src?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  private apiUrl =   `${environment.apiUrl}/achievements-missing`;
  private outfitsUrl = `${environment.apiUrl}/outfits`; 
  private mountsUrl = `${environment.apiUrl}/mounts`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAchievements(auctionId: string): Observable<Achievement[]> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.get<Achievement[]>(`${this.apiUrl}/${auctionId}`, { headers });
  }

  // Método para obter os outfits
  getOutfits(): Observable<Outfit[]> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.get<Outfit[]>(this.outfitsUrl, { headers });
  }

  // Método para obter os mounts
  getMounts(): Observable<Mount[]> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.get<Mount[]>(this.mountsUrl, { headers });
  }
}
