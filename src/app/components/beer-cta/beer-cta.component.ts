import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-beer-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beer-cta.component.html',
  styleUrl: './beer-cta.component.scss',
})
export class BeerCtaComponent implements OnInit {
  readonly showTooltip = signal<boolean>(false);
  readonly isModalOpen = signal<boolean>(false);

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Mostra o tooltip após 1 segundo
    setTimeout(() => {
      this.showTooltip.set(true);
    }, 1000);
  }

  onBeerClick(): void {
    this.analyticsService.trackEvent('beer_cta_click', {
      event_category: 'donation',
      event_label: 'beer_cta_button',
    });
    this.isModalOpen.set(true);
  }

  onModalClose(): void {
    this.analyticsService.trackEvent('beer_modal_close', {
      event_category: 'donation',
      event_label: 'modal_close_button',
    });
    this.isModalOpen.set(false);
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.analyticsService.trackEvent('beer_modal_close', {
        event_category: 'donation',
        event_label: 'modal_backdrop_click',
      });
      this.onModalClose();
    }
  }

  copyCharacterName(): void {
    const characterName = 'Humilde Taberneiro';
    navigator.clipboard
      .writeText(characterName)
      .then(() => {
        // Tracking do evento de copiar nome
        this.analyticsService.trackEvent('copy_character_name', {
          event_category: 'donation',
          event_label: 'humilde_taberneiro',
        });

        // Opcional: mostrar feedback visual de que foi copiado
        const button = event?.target as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copiado!';
          setTimeout(() => {
            button.innerHTML =
              '<img src="assets/icons-svg/copy.svg" alt="Copiar" class="copy-icon" />';
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Erro ao copiar nome:', err);
      });
  }
}
