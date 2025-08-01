import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './services/analytics.service';
import { BeerCtaComponent } from './components/beer-cta/beer-cta.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, BeerCtaComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'tavernatibiana';

  private readonly currentRoute = signal<string>('');

  readonly showBeerCta = computed(() => {
    const route = this.currentRoute();
    return route !== '' && route !== 'login';
  });

  constructor(
    private analyticsService: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Track app initialization
    this.analyticsService.trackEvent('app_initialized', {
      app_name: 'Taverna Tibiana',
    });

    // Monitor route changes to show/hide beer CTA
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        const route = url === '/' ? '' : url.replace('/', '');
        this.currentRoute.set(route);
      });
  }
}
