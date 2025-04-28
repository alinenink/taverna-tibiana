import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasteryService } from '../../services/animous.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-animous-mastery.',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [MasteryService],
  templateUrl: './animous-mastery.component.html',
})
export class AnimousMasteryComponent {
  filtros = { nome: '', dificuldade: '', classe: '' };

  constructor(public service: MasteryService) {
    this.service.buscar(this.filtros);
  }

  buscar(event?: Event) {
    event?.preventDefault();
    this.service.buscar(this.filtros, 1);
    console.log(this.service.dados())

  }

  paginaAnterior() {
    const novaPagina = this.service.paginaAtual() - 1;
    if (novaPagina >= 1) {
      this.service.buscar(this.filtros, novaPagina);
    }
  }

  proximaPagina() {
    const novaPagina = this.service.paginaAtual() + 1;
    if (novaPagina <= this.service.totalPaginas()) {
      this.service.buscar(this.filtros, novaPagina);
    }
  }

  selecionar(event: any, mastery: any) {
    const checked = event.target.checked;
    this.service.alternarSelecao(mastery, checked);
  }

  isSelecionado(id: number): boolean {
    return this.service.selecionados().some(m => m.id === id);
  }

  limparSelecao() {
    this.service.selecionados.set([]);
  }

  onUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.service.importarJson(file);
    }
  }
  
}
