// achievements.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

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
  constructor(private http: HttpClient) {}

  getAchievements(auctionId: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/${auctionId}`);
  }

  // Método para obter os outfits
  getOutfits(): Observable<Outfit[]> {
    return this.http.get<Outfit[]>(this.outfitsUrl);
  }

  // Método para obter os mounts
  getMounts(): Observable<Mount[]> {
    return this.http.get<Mount[]>(this.mountsUrl);
  }
}
