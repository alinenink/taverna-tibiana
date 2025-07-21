import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuctionIdModalComponent } from '../auction-id-modal/auction-id-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, AuctionIdModalComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Controla o estado de exibição do modal
  isAuctionIdModalOpen = false;
  carregando: boolean = true;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private scrollService: ScrollService
  ) {
    setTimeout(() => {
      this.carregando = false;
    }, 2000);
  }

  ngOnInit(): void {
    this.scrollService.scrollToTop();
  }

  // Chamada ao clicar no ícone de ajuda (abrir modal)
  openAuctionIdModal(): void {
    this.analyticsService.trackButtonClick('help_modal', 'home');
    this.isAuctionIdModalOpen = true;
  }

  // Recebe a notificação do modal quando fechado
  onModalClosed(): void {
    this.isAuctionIdModalOpen = false;
  }

  navigateToSimulacao(): void {
    this.analyticsService.trackButtonClick('navigate_simulation', 'home');
    this.router.navigate(['/simulacao']);
  }
}
