import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [AchievementsService],
})
export class ConsultComponent implements OnInit {
  characterData: any = null; // Dados do personagem (contendo os achievements como array de strings ou objeto)
  allAchievements: any; // Todos os achievements disponíveis (do backend)
  matchedAchievements: Achievement[] = []; // Achievements que deram match (presentes no personagem)
  unmatchedAchievements: Achievement[] = []; // Achievements que não deram match
  outfits: Outfit[] = [];
  mounts: Mount[] = [];
  mountsPossui: Mount[] = [];
  mountsNaoPossui: Mount[] = [];
  outfitsPossui: Outfit[] = [];
  outfitsNaoPossui: Outfit[] = [];
  characterId = '';
  quests: any;
  gemCount: any;
  rareAchiviements: any;

  constructor(
    private http: HttpClient,
    @Inject(AchievementsService)
    private achievementsService: AchievementsService
  ) {}

  ngOnInit(): void {}

  consultarPersonagem(): void {
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
        },
      });
  }

  getAchievements(auctionID: string): void {
    this.achievementsService.getAchievements(auctionID).subscribe({
      next: (data) => {
        this.allAchievements = data;
      },
      error: (error) => {
        console.error('Erro ao recuperar achievements:', error);
      },
    });

  //  this.exportPdf();
  }

  exportPdf(): void {
    const doc = new jsPDF();
  
  // Registra a fonte no jsPDF
  doc.addFileToVFS("MedievalSharp-Book.ttf", medievalFontBase64);
  doc.addFont("MedievalSharp-Book.ttf", "MedievalSharp", "normal");
  doc.setFont("MedievalSharp", "normal");
  
    // === BACKGROUND ===
    // Substitua 'data:image/jpeg;base64,...' pela imagem de fundo desejada (aparência de papiro)
    const backgroundImg = 'data:image/jpeg;base64,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';
  
    // Função para adicionar o background na página atual
    function addBackground() {
      doc.addImage(
        backgroundImg,
        'JPEG',
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight()
      );
    }
  
    // Adiciona o background na primeira página
    addBackground();
  
    // Sobrescreve o método addPage para incluir o background em todas as páginas
// Sobrescreve o método addPage para incluir o background em todas as páginas e retornar o jsPDF
const originalAddPage = doc.addPage.bind(doc);
doc.addPage = function(
  format?: string | number[] | undefined, 
  orientation?: "p" | "portrait" | "l" | "landscape" | undefined
): jsPDF {
  originalAddPage(format, orientation);
  addBackground();
  return doc;
};

  
    // === CONTEÚDO DO PDF ===
  
    // --- TÍTULO ---
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Resumo do Charlover', 14, 20);
    doc.setFontSize(12);
  
    // --- ÍNDICE COM NAVEGAÇÃO INTERNA ---
    doc.text('1. Achievements não conquistados', 14, 30);
    doc.text('2. Montarias que faltam', 14, 38);
    doc.text('3. Outfits que faltam', 14, 46);
  
    // Definir posições de destino (Y)
    let yAchievements = 60;
    let yMounts = 0;
    let yOutfits = 0;
  
    // --- SESSÃO 1: Achievements ---
    doc.setFontSize(16);
    doc.setTextColor(22, 160, 133);
    doc.text('Achievements que você ainda não conquistou', 14, yAchievements);
  
    const sortedUnmatched = this.unmatchedAchievements
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    const achievementsBody = sortedUnmatched.map((achievement) => {
      const link = `https://tibia.fandom.com/wiki/${achievement.name.replace(/\s+/g, '_')}`;
      return [achievement.name, achievement.description, achievement.points, link];
    });
  
    autoTable(doc, {
      startY: yAchievements + 10,
      head: [['Name', 'Description', 'Points', 'Link']],
      body: achievementsBody,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.raw) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            { url: data.cell.raw }
          );
        }
      },
    });
  
    let finalY = (doc as any).previousAutoTable?.finalY;
    let yPos = finalY ? finalY + 20 : 80;
  
    // --- SESSÃO 2: Montarias ---
    yMounts = yPos;
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 255);
    doc.text('Montarias que ainda esperam por você!', 14, yMounts);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Explore o mundo e conquiste essas montarias únicas!', 14, yMounts + 8);
  
    const mountsBody = this.mountsNaoPossui.map((mount) => [
      mount.name,
      mount.tamingMethod,
    ]);
  
    autoTable(doc, {
      startY: yMounts + 15,
      head: [['Nome', 'Método de Domesticação']],
      body: mountsBody,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [100, 100, 255] },
    });
  
    finalY = (doc as any).previousAutoTable?.finalY;
    yPos = finalY ? finalY + 20 : 80;
  
    // --- SESSÃO 3: Outfits ---
    yOutfits = yPos;
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(255, 160, 100);
    doc.text('Outfits que ainda faltam para seu guarda-roupa charlover!', 14, yOutfits);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Complete seu estilo e mostre que você é um verdadeiro explorador!', 14, yOutfits + 8);
  
    autoTable(doc, {
      startY: yOutfits + 15,
      head: [['Nome', 'Tipo', 'Acesso']],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [255, 160, 100] },
    });
  
    // --- LINKS INTERNOS CLICÁVEIS ---
    const pageNumber = (doc.internal as any).getCurrentPageInfo().pageNumber;
    doc.link(14, 30 - 3, 150, 5, { pageNumber, top: yAchievements - 5 });
    doc.link(14, 38 - 3, 150, 5, { pageNumber, top: yMounts - 5 });
    doc.link(14, 46 - 3, 150, 5, { pageNumber, top: yOutfits - 5 });
  
    doc.save('charlover_resumo.pdf');
  }
  
  
}
