import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private router: Router) {
    this.initializeRouteTracking();
  }

  private initializeRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }

  // Track page views
  trackPageView(pagePath: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pagePath
      });
    }
  }

  // Track custom events
  trackEvent(eventName: string, parameters?: { [key: string]: any }): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }

  // Track user actions
  trackUserAction(action: string, category: string, label?: string, value?: number): void {
    this.trackEvent('user_action', {
      event_category: category,
      event_label: label,
      value: value,
      action: action
    });
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, status: number, responseTime?: number): void {
    this.trackEvent('api_call', {
      event_category: 'api',
      event_label: `${method} ${endpoint}`,
      value: status,
      response_time: responseTime
    });
  }

  // Track errors
  trackError(errorType: string, errorMessage: string, errorStack?: string): void {
    this.trackEvent('error', {
      event_category: 'error',
      event_label: errorType,
      error_message: errorMessage,
      error_stack: errorStack
    });
  }

  // Track authentication events
  trackLogin(method: string = 'email'): void {
    this.trackEvent('login', {
      method: method
    });
  }

  trackLogout(): void {
    this.trackEvent('logout');
  }

  trackRegistration(method: string = 'email'): void {
    this.trackEvent('sign_up', {
      method: method
    });
  }

  // Track calculator usage
  trackCalculatorUsage(calculatorType: string, parameters?: any): void {
    this.trackEvent('calculator_used', {
      calculator_type: calculatorType,
      parameters: JSON.stringify(parameters)
    });
  }

  // Track character consultation
  trackCharacterConsultation(characterId: string): void {
    this.trackEvent('character_consultation', {
      character_id: characterId
    });
  }

  // Track mastery interactions
  trackMasteryAction(action: string, masteryType?: string): void {
    this.trackEvent('mastery_action', {
      action: action,
      mastery_type: masteryType
    });
  }

  // Track simulation usage
  trackSimulationUsage(simulationType: string, parameters?: any): void {
    this.trackEvent('simulation_used', {
      simulation_type: simulationType,
      parameters: JSON.stringify(parameters)
    });
  }

  // Track achievement interactions
  trackAchievementAction(action: string, achievementType?: string): void {
    this.trackEvent('achievement_action', {
      action: action,
      achievement_type: achievementType
    });
  }

  // Track outfit/mount interactions
  trackOutfitMountAction(action: string, itemType: string, itemName?: string): void {
    this.trackEvent('outfit_mount_action', {
      action: action,
      item_type: itemType,
      item_name: itemName
    });
  }

  // Track quest interactions
  trackQuestAction(action: string, questName?: string): void {
    this.trackEvent('quest_action', {
      action: action,
      quest_name: questName
    });
  }

  // Track gem interactions
  trackGemAction(action: string, gemType?: string): void {
    this.trackEvent('gem_action', {
      action: action,
      gem_type: gemType
    });
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent('form_submit', {
      form_name: formName,
      success: success
    });
  }

  // Track button clicks
  trackButtonClick(buttonName: string, page?: string): void {
    this.trackEvent('button_click', {
      button_name: buttonName,
      page: page
    });
  }

  // Track search actions
  trackSearch(searchTerm: string, searchType: string): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      search_type: searchType
    });
  }

  // Track time spent on page
  trackTimeOnPage(page: string, timeSpent: number): void {
    this.trackEvent('time_on_page', {
      page: page,
      time_spent: timeSpent
    });
  }

  // Track user engagement
  trackEngagement(action: string, content: string): void {
    this.trackEvent('engagement', {
      action: action,
      content: content
    });
  }
} 