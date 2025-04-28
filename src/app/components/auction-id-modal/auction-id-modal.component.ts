import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auction-id-modal',
  templateUrl: './auction-id-modal.component.html',
  styleUrls: ['./auction-id-modal.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AuctionIdModalComponent {
  /**
   * Define se o modal está visível (true) ou não (false).
   * Quem controla esse estado é, em geral, o componente pai.
   */
  @Input() isOpen = false;

  /**
   * Emite um evento para avisar que o modal foi fechado.
   */
  @Output() modalClosed = new EventEmitter<void>();

  /**
   * Fecha o modal: dispara o evento 'modalClosed'
   * para que o pai atualize a variável de controle.
   */
  closeModal(): void {
    this.modalClosed.emit();
  }

  /**
   * Fecha o modal se o usuário clicar no backdrop (fundo).
   * O 'event.currentTarget' representa a div que envolve o conteúdo.
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
