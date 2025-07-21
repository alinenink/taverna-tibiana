import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  
  /**
   * Faz scroll suave para o topo da página
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Faz scroll instantâneo para o topo da página
   */
  scrollToTopInstant(): void {
    window.scrollTo(0, 0);
  }

  /**
   * Faz scroll para uma posição específica
   */
  scrollToPosition(x: number, y: number, smooth: boolean = true): void {
    window.scrollTo({
      top: y,
      left: x,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
} 