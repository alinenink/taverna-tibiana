import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { medievalFontBase64 } from './medievalfont.js';

export interface Mastery {
  id: number;
  name: string;
  difficulty: string;
  class: { id: number; name: string; image: string };
}

@Injectable({ providedIn: 'root' })
export class MasteryService {
  private baseUrl =  environment.apiUrl + '/animous-mastery/animous';

  dados = signal<Mastery[]>([]);
  selecionados = signal<Mastery[]>([]);
  paginaAtual = signal(1);
  totalPaginas = signal(1);
  totalResultados = signal(0);
  toastMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  buscar(filtros: { nome?: string; dificuldade?: string; classe?: string }, page = 1) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '20',
      name: filtros.nome || '',
      difficulty: filtros.dificuldade || '',
      class: filtros.classe || ''
    });

    this.http.get<any>(`${this.baseUrl}?${params.toString()}`).subscribe(res => {
      this.dados.set(
        res.data.map((item: any) => ({
          ...item,
          image: `https://static.tibia.com/images/library/${item.name.replace(/\s+/g, '').toLowerCase()}.gif`
        }))
      );
            this.totalPaginas.set(res.totalPages);
      this.totalResultados.set(res.total);
      this.paginaAtual.set(res.page);
    });
  }

  alternarSelecao(mastery: Mastery, checked: boolean) {
    const atual = this.selecionados();
    if (checked) {
      if (!atual.some(m => m.id === mastery.id)) {
        this.selecionados.set([...atual, mastery]);
      }
    } else {
      this.selecionados.set(atual.filter(m => m.id !== mastery.id));
    }
  }

  exportarJson() {
    const data = this.selecionados();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-mastery.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportarPdf() {
    const data = this.selecionados();
  
    if (data.length === 0) {
      alert('Nenhum mastery selecionado para exportar!');
      return;
    }
  
    const doc = new jsPDF();
  
    // Registra a fonte medieval
    doc.addFileToVFS("MedievalSharp-Book.ttf", medievalFontBase64);
    doc.addFont("MedievalSharp-Book.ttf", "MedievalSharp", "normal");
    doc.setFont("MedievalSharp", "normal");
  
    doc.setFontSize(16);
    doc.text('Meus Masteries Selecionados', 105, 20, { align: 'center' });
  
    autoTable(doc, {
      startY: 30,
      head: [['Nome', 'Dificuldade', 'Classe']],
      body: data.map(item => [
        item.name,
        item.difficulty,
        item.class.name
      ]),
      theme: 'grid',
      styles: {
        font: 'MedievalSharp',
        fontSize: 10,
        textColor: [60, 40, 20],
        lineColor: [160, 120, 70],
      },
      headStyles: {
        fillColor: [232, 217, 165], // tom pastel da tabela
        textColor: [60, 40, 20],
        lineWidth: 0.5,
        lineColor: [160, 120, 70],
      },
      alternateRowStyles: {
        fillColor: [253, 248, 228]
      },
      tableLineColor: [160, 120, 70],
      tableLineWidth: 0.5
    });
  
    doc.save('meus-masteries.pdf');
  }

  importarJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Mastery[];
        if (Array.isArray(data)) {
          this.selecionados.set(data);
          this.toastMessage.set('Masteries carregados com sucesso!');
          setTimeout(() => this.toastMessage.set(null), 3000); // Some depois de 3s
        } else {
          this.toastMessage.set('Arquivo inválido!');
        }
      } catch (e) {
        this.toastMessage.set('Erro ao ler o arquivo!');
      }
    };
    reader.readAsText(file);
  }  
}
