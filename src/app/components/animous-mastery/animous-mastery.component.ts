import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mastery, MasteryService } from '../../services/animous.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-animous-mastery.',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [MasteryService],
  templateUrl: './animous-mastery.component.html',
})
export class AnimousMasteryComponent implements OnInit {
  filtros = { nome: '', dificuldade: '', classe: '' };
  criterioOrdenacao: 'name' | 'difficulty' | 'class.name' = 'name';
  isMobile = window.innerWidth <= 768;
  exibirModalExportar = false;
  ordenarPorDificuldade = false;
  ordenarPorAlfabetica = false;
  carregando: boolean = true;

  ordenacoes: { [key: string]: boolean } = {
    name: true,
    difficulty: true,
    'class.name': true,
  };

  constructor(public service: MasteryService) {
    this.service.buscar(this.filtros);
    setTimeout(() => {
      this.carregando = false;
    }, 1000);
  }

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  abrirModalExportar() {
    this.exibirModalExportar = true;
  }
  
  fecharModalExportar() {
    this.exibirModalExportar = false;
    this.ordenarPorDificuldade = false;
    this.ordenarPorAlfabetica = false;
  }
  
  confirmarExportacaoPdf() {
    const dificuldadeMap: Record<string, number> = {
      Harmless: 0,
      Easy: 1,
      Medium: 2,
      Hard: 3,
      Challenging: 4,
      Rare: 5,
    };
  
    const selecionados = [...this.service.selecionados()];
  
    if (this.ordenarPorDificuldade) {
      selecionados.sort((a, b) => {
        const dA = dificuldadeMap[a.difficulty?.trim()] ?? 999;
        const dB = dificuldadeMap[b.difficulty?.trim()] ?? 999;
        return dA - dB;
      });
    } else if (this.ordenarPorAlfabetica) {
      selecionados.sort((a, b) => a.name.localeCompare(b.name));
    }
  
    this.service.exportarPdf(selecionados);
    this.fecharModalExportar();
  }
  

  ordenarPor(campo: 'name' | 'difficulty' | 'class.name') {
    this.ordenacoes[campo] = !this.ordenacoes[campo];
    this.service.ordenarDados(campo, this.ordenacoes[campo]);
  }

  buscar(event?: Event) {
    event?.preventDefault();
    this.service.buscar(this.filtros, 1);
    this.carregando = false;
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
    return this.service.selecionados().some((m) => m.id === id);
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

  toggleSelecao(item: Mastery) {
    const isSelected = this.isSelecionado(item.id);
    this.service.alternarSelecao(item, !isSelected);
  }
}
