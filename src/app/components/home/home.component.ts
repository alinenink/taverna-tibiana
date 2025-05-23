import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuctionIdModalComponent } from '../auction-id-modal/auction-id-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterModule, AuctionIdModalComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Controla o estado de exibição do modal
  isAuctionIdModalOpen = false;
  carregando: boolean = true;

  constructor(private router: Router) {
    setTimeout(() => {
      this.carregando = false;
    }, 2000);
  }

  // Chamada ao clicar no ícone de ajuda (abrir modal)
  openAuctionIdModal(): void {
    this.isAuctionIdModalOpen = true;
  }

  // Recebe a notificação do modal quando fechado
  onModalClosed(): void {
    this.isAuctionIdModalOpen = false;
  }

  navigateToSimulacao(): void {
    this.router.navigate(['/simulacao']);
  }
}
