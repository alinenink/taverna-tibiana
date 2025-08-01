import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from './services/analytics.service';
import { BeerCtaComponent } from './components/beer-cta/beer-cta.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, BeerCtaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'tavernatibiana';

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Track app initialization
    this.analyticsService.trackEvent('app_initialized', {
      app_name: 'Taverna Tibiana',
    });
  }
}
