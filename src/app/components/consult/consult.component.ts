import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass } from '@angular/common';
import {
  Achievement,
  AchievementsService,
  Mount,
  Outfit,
} from '../../services/consult.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { medievalFontBase64 } from '../../services/medievalfont.js';
import { environment } from '../../environments/environments';
import { rareAchievements as rareAchievementsList } from '../../models/rareAchievements';
import { quests as questModel } from '../../models/quests';
import { RouterModule } from '@angular/router';

declare module 'jspdf' {
  interface jsPDF {
    previousAutoTable?: {
      finalY: number;
    };
  }
}

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  providers: [AchievementsService],
})
export class ConsultComponent implements OnInit {
  characterData: any = null;
  allAchievements: any;
  matchedAchievements: Achievement[] = [];
  unmatchedAchievements: Achievement[] = [];
  outfits: Outfit[] = [];
  mounts: Mount[] = [];
  mountsPossui: Mount[] = [];
  mountsNaoPossui: Mount[] = [];
  outfitsPossui: Outfit[] = [];
  outfitsNaoPossui: Outfit[] = [];
  characterId = '';
  quests: any;
  gemCount: any;
  greaterGems: any;
  rareAchiviements: any;
  carregando: boolean = false;
  gemsPorPagina = 10;
  paginaGemsAtual = 1;

  // Modais e opções
  exibirModalExportarPdf = false;
  exibirModalRaros = false;
  exibirModalQuests = false;
  exibirModalGems = false;
  tipoExportacao: 'achievements' | 'mounts' | 'outfits' | 'completo' =
    'completo';

  // Utilitário para uso em template
  objectKeys = Object.keys;
  rareAchievementsList = rareAchievementsList;
  questsModel = questModel;
  questsPorCategoria: { [key: string]: string[] } = {};

  constructor(
    private http: HttpClient,
    @Inject(AchievementsService)
    private achievementsService: AchievementsService
  ) {}

  ngOnInit(): void {}

  consultarPersonagem(): void {
    this.carregando = true;
    this.http
      .get(`${environment.apiUrl}/auction/${this.characterId}`)
      .subscribe({
        next: (data: any) => {
          this.characterData = data.details;

          // Atribui os dados recebidos
          this.outfitsPossui = data.matchOutfits.commonOutfits || [];
          this.outfitsNaoPossui = data.matchOutfits.modelOnlyOutfits || [];
          this.quests = data.quests;
          this.gemCount = data.gemCount;
          this.greaterGems = data.greaterGems;
          this.rareAchiviements = data.rareAchievements;

          // Aplicar regras específicas nos outfits que o personagem possui
          this.outfitsPossui = this.outfitsPossui.filter((o: any) => {
            const outfitName = o.name?.toLowerCase() || '';
            // Regra para Yalarian Outfit
            if (outfitName.includes('yalaharian')) {
              if (o.base && o.addon2) {
                // Se possui base e addon1, remove da lista
                return false;
              } else if (o.base && !o.addon2) {
                // Se existe apenas o base, seta addon1 como true
                o.addon2 = true;
              }
            }
            // Regra para Royal Bounacean Advisor
            if (outfitName.includes('royal bounacean advisor')) {
              if (o.base && o.addon1) {
                return false;
              } else if (o.base && !o.addon1) {
                o.addon2 = true;
              }
            }
            return true;
          });

          // Regras para Nightmare / Brotherhood:
          const possuiNightmare = this.outfitsPossui.some((o: any) =>
            o.name?.toLowerCase().includes('nightmare')
          );
          const possuiBrotherhood = this.outfitsPossui.some((o: any) =>
            o.name?.toLowerCase().includes('brotherhood')
          );
          if (possuiNightmare) {
            // Remove do "não possui" os outfits cujo nome contenha "brotherhood"
            this.outfitsNaoPossui = this.outfitsNaoPossui.filter(
              (o: any) =>
                !(o.name && o.name.toLowerCase().includes('brotherhood'))
            );
          }
          if (possuiBrotherhood) {
            // Remove do "não possui" os outfits cujo nome contenha "nightmare"
            this.outfitsNaoPossui = this.outfitsNaoPossui.filter(
              (o: any) =>
                !(o.name && o.name.toLowerCase().includes('nightmare'))
            );
          }

          // Filtra os que possuem addons faltando
          const possuiComAddonFaltando = this.outfitsPossui.filter(
            (o: any) => !o.addon1 || !o.addon2
          );

          // Remove do "possui" os que têm addons faltando
          this.outfitsPossui = this.outfitsPossui.filter(
            (o: any) => o.addon1 && o.addon2
          );

          // Junta os outfits com addon incompleto ao "não possui"
          this.outfitsNaoPossui = [
            ...this.outfitsNaoPossui,
            ...possuiComAddonFaltando,
          ];

          // Ordena o array final por nome
          this.outfitsNaoPossui.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );

          // Montarias (sem alteração)
          this.mountsNaoPossui = data.matchMounts.modelOnlyMounts || [];
          this.mountsPossui = data.matchMounts.commonMounts || [];

          this.getAchievements(this.characterId);
        },
        error: (error) => {
          console.error('Erro ao buscar dados do personagem:', error);
          this.carregando = false;
        },
      });
  }

  getAchievements(auctionID: string): void {
    this.achievementsService.getAchievements(auctionID).subscribe({
      next: (data) => {
        this.allAchievements = data;
        this.agruparQuestsPorCategoria();
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao recuperar achievements:', error);
        this.carregando = false;
      },
    });
  }

  private adicionarDetalhesPersonagem(doc: jsPDF): number {
    doc.setFontSize(18);
    doc.text('Resumo do Charlover', 14, 20);
    const y = 30;
    doc.setFontSize(12);
    doc.text(`Nome: ${this.characterData?.name || '---'}`, 14, y);
    doc.text(`Mundo: ${this.characterData?.world || '---'}`, 14, y + 6);
    doc.text(`Vocação: ${this.characterData?.vocation || '---'}`, 14, y + 12);
    doc.text(`Level: ${this.characterData?.level || '---'}`, 14, y + 18);
    return y + 30;
  }

  exportAchievementsPdf(): void {
    const doc = new jsPDF();
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');

    const startY = this.adicionarDetalhesPersonagem(doc);
    const sorted = (this.allAchievements?.missing || []).sort(
      (a, b) => a.points - b.points
    );
    const achievementsBody = sorted.map((achievement: any) => [
      achievement.name,
      achievement.description,
      achievement.points,
      `https://tibia.fandom.com/wiki/${achievement.name.replace(/\s+/g, '_')}`,
    ]);

    autoTable(doc, {
      startY,
      head: [['Nome', 'Descrição', 'Pontos', 'Link']],
      body: achievementsBody,
      theme: 'grid',
      styles: { font: 'MedievalSharp', fontSize: 10 },
      headStyles: { fillColor: [232, 217, 165] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 90 },
        2: { cellWidth: 15 },
        3: { cellWidth: 30 },
      },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.raw) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            {
              url: data.cell.raw,
            }
          );
        }
      },
    });

    doc.save('charlover_achievements.pdf');
  }

  exportMountsPdf(): void {
    const doc = new jsPDF();
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');

    const startY = this.adicionarDetalhesPersonagem(doc);
    const mountsBody = this.mountsNaoPossui.map((mount) => [
      mount.name,
      `https://tibia.fandom.com/wiki/${mount.name.replace(/\s+/g, '_')}`,
    ]);

    autoTable(doc, {
      startY,
      head: [['Nome', 'Link']],
      body: mountsBody,
      theme: 'grid',
      styles: { font: 'MedievalSharp', fontSize: 10 },
      headStyles: { fillColor: [200, 220, 255] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 100 },
      },
      didDrawCell: (data) => {
        if (data.column.index === 1 && data.cell.raw) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            {
              url: data.cell.raw,
            }
          );
        }
      },
    });

    doc.save('charlover_mounts.pdf');
  }

  exportOutfitsPdf(): void {
    const doc = new jsPDF();
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');

    const startY = this.adicionarDetalhesPersonagem(doc);
    const outfitsBody = this.outfitsNaoPossui.map((outfit) => [
      outfit.name,
      outfit.base ? 'Sim' : 'Não',
      outfit.addon1 ? 'Sim' : 'Não',
      outfit.addon2 ? 'Sim' : 'Não',
    ]);

    autoTable(doc, {
      startY,
      head: [['Nome', 'Base', 'Addon 1', 'Addon 2']],
      body: outfitsBody,
      theme: 'grid',
      styles: { font: 'MedievalSharp', fontSize: 10 },
      headStyles: { fillColor: [255, 200, 150] },
    });

    doc.save('charlover_outfits.pdf');
  }

  exportResumoCompleto(): void {
    const doc = new jsPDF();
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');

    let y = this.adicionarDetalhesPersonagem(doc);

    // Achievements
    const sorted = (this.allAchievements?.missing || []).sort(
      (a, b) => a.points - b.points
    );
    const achievementsBody = sorted.map((achievement: any) => [
      achievement.name,
      achievement.description,
      achievement.points,
      `https://tibia.fandom.com/wiki/${achievement.name.replace(/\s+/g, '_')}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Nome', 'Descrição', 'Pontos', 'Link']],
      body: achievementsBody,
      theme: 'grid',
      styles: { font: 'MedievalSharp', fontSize: 10 },
      headStyles: { fillColor: [232, 217, 165] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 90 },
        2: { cellWidth: 15 },
        3: { cellWidth: 30 },
      },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.raw) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            {
              url: data.cell.raw,
            }
          );
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    doc.addPage();
    y = this.adicionarDetalhesPersonagem(doc);

    // Mounts
    const mountsBody = this.mountsNaoPossui.map((mount) => [
      mount.name,
      `https://tibia.fandom.com/wiki/${mount.name.replace(/\s+/g, '_')}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Nome', 'Link']],
      body: mountsBody,
      theme: 'grid',
      styles: { font: 'MedievalSharp', fontSize: 10 },
      headStyles: { fillColor: [200, 220, 255] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 100 },
      },
      didDrawCell: (data) => {
        if (data.column.index === 1 && data.cell.raw) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            {
              url: data.cell.raw,
            }
          );
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    doc.addPage();
    y = this.adicionarDetalhesPersonagem(doc);

    // Outfits
    const outfitsBody = this.outfitsNaoPossui.map((outfit) => [
      outfit.name,
      outfit.base ? 'Sim' : 'Não',
      outfit.addon1 ? 'Sim' : 'Não',
      outfit.addon2 ? 'Sim' : 'Não',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Nome', 'Base', 'Addon 1', 'Addon 2']],
      body: outfitsBody,
      theme: 'grid',
      styles: { font: 'MedievalSharp', fontSize: 10 },
      headStyles: { fillColor: [255, 200, 150] },
    });

    doc.save('charlover_resumo_completo.pdf');
  }

  abrirModalExportarPdf() {
    this.exibirModalExportarPdf = true;
  }

  fecharModalExportarPdf() {
    this.exibirModalExportarPdf = false;
  }

  confirmarExportacaoTipo() {
    switch (this.tipoExportacao) {
      case 'achievements':
        this.exportAchievementsPdf();
        break;
      case 'mounts':
        this.exportMountsPdf();
        break;
      case 'outfits':
        this.exportOutfitsPdf();
        break;
      case 'completo':
      default:
        this.exportResumoCompleto();
        break;
    }
    this.fecharModalExportarPdf();
  }

  abrirModalRaros() {
    this.exibirModalRaros = true;
  }

  fecharModalRaros() {
    this.exibirModalRaros = false;
  }

  abrirModalQuests() {
    this.exibirModalQuests = true;
  }

  fecharModalQuests() {
    this.exibirModalQuests = false;
  }

  abrirModalGems() {
    this.exibirModalGems = true;
  }

  fecharModalGems() {
    this.exibirModalGems = false;
  }
  possuiAchievementRaro(nome: string): boolean {
    return this.rareAchiviements?.includes(nome);
  }

  // Após setar this.quests com os dados da API
  agruparQuestsPorCategoria() {
    const categorias: { [key: string]: string[] } = {
      utilitary: [],
      access: [],
      bosses: [],
    };

    this.objectKeys(this.questsModel).forEach((key) => {
      const questApi = this.quests.quests.find((q: any) => q.name === key);
      const categoria = questApi?.category || 'utilitary'; // fallback
      categorias[categoria].push(key);
    });

    this.questsPorCategoria = categorias;
  }

  possuiQuest(nome: string): boolean {
    return this.quests?.quests?.some((q: any) => q.name === nome && q.done);
  }

  get gemsPaginadas(): string[] {
    const inicio = (this.paginaGemsAtual - 1) * this.gemsPorPagina;
    const fim = this.paginaGemsAtual * this.gemsPorPagina;
    return this.greaterGems.slice(inicio, fim);
  }
  
  get totalPaginasGems(): number {
    return Math.ceil(this.greaterGems.length / this.gemsPorPagina);
  }
  
  proximaPaginaGems(): void {
    if (this.paginaGemsAtual < this.totalPaginasGems) {
      this.paginaGemsAtual++;
    }
  }
  
  paginaAnteriorGems(): void {
    if (this.paginaGemsAtual > 1) {
      this.paginaGemsAtual--;
    }
  }
}
