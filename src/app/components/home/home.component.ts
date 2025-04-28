import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuctionIdModalComponent } from '../auction-id-modal/auction-id-modal.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule, AuctionIdModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Controla o estado de exibição do modal
  isAuctionIdModalOpen = false;

  constructor(private router: Router) {}

  // Chamada ao clicar no ícone de ajuda (abrir modal)
  openAuctionIdModal(): void {
    this.isAuctionIdModalOpen = true;
  }

  // Recebe a notificação do modal quando fechado
  onModalClosed(): void {
    this.isAuctionIdModalOpen = false;
  }

  // Exemplo: navegação para a simulação
  navigateToSimulacao(): void {
    // ou window.location.href = 'simulacao.html'
    this.router.navigate(['/simulacao']);
  }
}
