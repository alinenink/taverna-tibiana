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
  occurrence?: string;
}

@Injectable({ providedIn: 'root' })
export class MasteryService {
  private baseUrl = environment.apiUrl + '/animous-mastery/animous';

  dados = signal<Mastery[]>([]);
  selecionados = signal<Mastery[]>([]);
  paginaAtual = signal(1);
  totalPaginas = signal(1);
  totalResultados = signal(0);
  toastMessage = signal<string | null>(null);
  private _dadosTodos: Mastery[] = [];

  constructor(private http: HttpClient) {}

  buscar(
    filtros: { nome?: string; dificuldade?: string; classe?: string },
    page = 1
  ) {
    const isRare = filtros.dificuldade?.toLowerCase() === 'rare';

    // Se já temos todos os dados carregados (por exemplo, após importar o JSON)
    if (this._dadosTodos.length > 0) {
      const dadosFiltrados = this._dadosTodos.filter((item) => {
        const matchNome = filtros.nome
          ? item.name.toLowerCase().includes(filtros.nome.toLowerCase())
          : true;
        const matchClasse = filtros.classe
          ? item.class.name.toLowerCase().includes(filtros.classe.toLowerCase())
          : true;
        const matchDificuldade = isRare
          ? item.occurrence === 'Very Rare'
          : filtros.dificuldade
          ? item.difficulty === filtros.dificuldade
          : true;
        return matchNome && matchClasse && matchDificuldade;
      });

      this.totalResultados.set(dadosFiltrados.length);
      this.totalPaginas.set(Math.ceil(dadosFiltrados.length / 20));
      this.paginaAtual.set(page);

      const start = (page - 1) * 20;
      const end = start + 20;
      this.dados.set(dadosFiltrados.slice(start, end));

      return;
    }

    const params = new URLSearchParams({
      page: isRare ? '1' : page.toString(),
      pageSize: isRare ? '9999' : '20', // busca tudo se rare
      name: filtros.nome || '',
      difficulty: isRare ? '' : filtros.dificuldade || '',
      class: filtros.classe || '',
    });

    this.http
      .get<any>(`${this.baseUrl}?${params.toString()}`)
      .subscribe((res) => {
        const filtrados = isRare
          ? res.data.filter((item: any) => item.occurrence === 'Very Rare')
          : res.data;

        const dadosFormatados = filtrados
          .map((item: any) => ({
            ...item,
            difficulty:
              item.occurrence === 'Very Rare' ? 'Rare' : item.difficulty,
            image: `https://static.tibia.com/images/library/${item.name
              .replace(/\s+/g, '')
              .toLowerCase()}.gif`,
          }))
          .sort((a: any, b: any) => {
            const dificuldade = { Easy: 0, Medium: 1, Hard: 2, Rare: 3 };
            return (
              dificuldade[a.difficulty] - dificuldade[b.difficulty] ||
              a.name.localeCompare(b.name) ||
              a.class.name.localeCompare(b.class.name)
            );
          });

        this.dados.set(dadosFormatados);
        this.totalPaginas.set(res.totalPages);
        this.totalResultados.set(res.total);
        this.paginaAtual.set(res.page);
      });
  }

  alternarSelecao(mastery: Mastery, checked: boolean) {
    const atual = this.selecionados();
    if (checked) {
      if (!atual.some((m) => m.id === mastery.id)) {
        this.selecionados.set([...atual, mastery]);
      }
    } else {
      this.selecionados.set(atual.filter((m) => m.id !== mastery.id));
    }
  }

  exportarJson() {
    const data = this.selecionados().map((item) => ({
      id: item.id,
      name: item.name,
      difficulty: item.difficulty,
      class: item.class.name,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-mastery.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportarPdf(data?: Mastery[]) {
    const masteries = data || this.selecionados();
    if (masteries.length === 0) {
      alert('Nenhum mastery selecionado para exportar!');
      return;
    }

    const doc = new jsPDF();

    // Registra a fonte medieval
    doc.addFileToVFS('MedievalSharp-Book.ttf', medievalFontBase64);
    doc.addFont('MedievalSharp-Book.ttf', 'MedievalSharp', 'normal');
    doc.setFont('MedievalSharp', 'normal');

    doc.setFontSize(16);
    doc.text('Meus Masteries Selecionados', 105, 20, { align: 'center' });

    autoTable(doc, {
      startY: 30,
      head: [['Nome', 'Dificuldade', 'Classe']],
      body: masteries.map((item) => [
        item.name,
        item.difficulty,
        item.class.name,
      ]),
      theme: 'grid',
      styles: {
        font: 'MedievalSharp',
        fontSize: 10,
        textColor: [60, 40, 20],
        lineColor: [160, 120, 70],
      },
      headStyles: {
        fillColor: [232, 217, 165],
        textColor: [60, 40, 20],
        lineWidth: 0.5,
        lineColor: [160, 120, 70],
      },
      alternateRowStyles: {
        fillColor: [253, 248, 228],
      },
      tableLineColor: [160, 120, 70],
      tableLineWidth: 0.5,
    });

    doc.save('meus-masteries.pdf');
  }

  importarJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as any[];
  
        if (Array.isArray(data)) {
          const reconstruidos = data.map((m: any) => ({
            ...m,
            class: typeof m.class === 'string' ? { name: m.class } : m.class,
          }));
  
          this.selecionados.set(reconstruidos);
          this.toastMessage.set('Masteries carregados com sucesso!');
  
          const selecionadosIds = new Set(reconstruidos.map((m) => m.id));
  
          this.http.get<any>(`${this.baseUrl}?page=1&pageSize=9999`).subscribe((res) => {
            const todos = res.data.map((item: any) => ({
              ...item,
              difficulty: item.occurrence === 'Very Rare' ? 'Rare' : item.difficulty,
              image: `https://static.tibia.com/images/library/${item.name.replace(/\s+/g, '').toLowerCase()}.gif`,
            }));
  
            const ordenado = todos.sort((a, b) => {
              const aSel = selecionadosIds.has(a.id) ? 0 : 1;
              const bSel = selecionadosIds.has(b.id) ? 0 : 1;
              return (
                aSel - bSel ||
                a.name.localeCompare(b.name) ||
                a.class.name.localeCompare(b.class.name)
              );
            });
  
            const pageSize = 20;
            const primeiraPagina = ordenado.slice(0, pageSize);
  
            this.dados.set(primeiraPagina);
            this._dadosTodos = ordenado;
            this.totalResultados.set(ordenado.length);
            this.totalPaginas.set(Math.ceil(ordenado.length / pageSize));
            this.paginaAtual.set(1);
          });
  
          setTimeout(() => this.toastMessage.set(null), 3000);
        } else {
          this.toastMessage.set('Arquivo inválido!');
        }
      } catch (e) {
        this.toastMessage.set('Erro ao ler o arquivo!');
      }
    };
    reader.readAsText(file);
  }
  

  ordenarDados(
    campo: 'name' | 'difficulty' | 'class.name',
    crescente: boolean
  ) {
    const prioridade = { Easy: 1, Medium: 2, Hard: 3 };

    const compare = (a: any, b: any): number => {
      let aValue = campo === 'class.name' ? a.class.name : a[campo];
      let bValue = campo === 'class.name' ? b.class.name : b[campo];

      if (campo === 'difficulty') {
        aValue = prioridade[aValue] || 0;
        bValue = prioridade[bValue] || 0;
      } else {
        aValue = aValue.toLowerCase?.() || '';
        bValue = bValue.toLowerCase?.() || '';
      }

      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    };

    const selecionadosIds = new Set(this.selecionados().map((m) => m.id));

    const ordenado = [...this.dados()]
      .sort((a, b) => compare(a, b) * (crescente ? 1 : -1))
      .sort(
        (a, b) =>
          Number(!selecionadosIds.has(a.id)) -
          Number(!selecionadosIds.has(b.id))
      );

    this.dados.set(ordenado);
  }
}
