import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';
import { AuthService } from './auth.service';
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
  private baseUrl = `${environment.apiUrl}/animous`;
  private userMasteryUrl = `${environment.apiUrl}/animous`;

  dados = signal<Mastery[]>([]);
  selecionados = signal<Mastery[]>([]);
  paginaAtual = signal(1);
  totalPaginas = signal(1);
  totalResultados = signal(0);
  toastMessage = signal<string | null>(null);
  showVisitorModal = signal<boolean>(false);
  private _dadosTodos: Mastery[] = [];
  filtros = { nome: '', dificuldade: '', classe: '' };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Carregar masteries do usuário ao inicializar
  carregarMasteriesUsuario(onFinish?: () => void) {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId) {
      console.error('User ID não encontrado');
      if (onFinish) onFinish();
      return;
    }
    if (!token) {
      console.error('Token não encontrado');
      if (onFinish) onFinish();
      return;
    }

    // PRIMEIRO: Carregar todos os masteries disponíveis

    const params = new URLSearchParams({
      action: 'list',
      page: '1',
      pageSize: '9999', // Buscar todos os masteries
      name: '',
      difficulty: '',
      class: '',
    });

    this.http
      .post<any>(
        `${this.baseUrl}?${params.toString()}`,
        {
          action: 'list',
          page: '1',
          pageSize: '9999',
          name: '',
          difficulty: '',
          class: '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe({
        next: res => {
          const todos = res.data.map((item: any) => ({
            ...item,
            difficulty: item.occurrence === 'Very Rare' ? 'Rare' : item.difficulty,
            image: `https://static.tibia.com/images/library/${item.name.replace(/\s+/g, '').toLowerCase()}.gif`,
          }));

          // Armazenar todos os masteries
          this._dadosTodos = todos;

          // SEGUNDO: Buscar masteries do usuário

          this.http
            .get<any>(`${environment.apiUrl}/animous-mastery/${userId}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
            .subscribe({
              next: response => {
                let payload: any[] = [];
                if (Array.isArray(response)) {
                  payload = response[0]?.payload;
                } else if (response && response.payload) {
                  payload =
                    typeof response.payload === 'string'
                      ? JSON.parse(response.payload)
                      : response.payload;
                }

                if (Array.isArray(payload) && payload.length > 0) {
                  // Marcar os masteries do usuário como selecionados
                  const masteriesUsuarioIds = new Set(payload.map((m: any) => m.id));
                  const selecionados = todos.filter((item: any) =>
                    masteriesUsuarioIds.has(item.id)
                  );
                  this.selecionados.set(selecionados);

                  // Ordenar com os selecionados primeiro
                  const ordenado = todos.sort((a, b) => {
                    const aSel = masteriesUsuarioIds.has(a.id) ? 0 : 1;
                    const bSel = masteriesUsuarioIds.has(b.id) ? 0 : 1;
                    return (
                      aSel - bSel ||
                      a.name.localeCompare(b.name) ||
                      a.class.name.localeCompare(b.class.name)
                    );
                  });

                  const pageSize = 20;
                  const primeiraPagina = ordenado.slice(0, pageSize);

                  this.dados.set(primeiraPagina);
                  this.totalResultados.set(ordenado.length);
                  this.totalPaginas.set(Math.ceil(ordenado.length / pageSize));
                  this.paginaAtual.set(1);

                  this.toastMessage.set('Masteries carregados do servidor!');
                  setTimeout(() => this.toastMessage.set(null), 3000);
                } else {
                  // Se não houver masteries salvos, apenas mostrar todos

                  const ordenado = todos.sort(
                    (a, b) =>
                      a.name.localeCompare(b.name) || a.class.name.localeCompare(b.class.name)
                  );

                  const pageSize = 20;
                  const primeiraPagina = ordenado.slice(0, pageSize);

                  this.dados.set(primeiraPagina);
                  this.totalResultados.set(ordenado.length);
                  this.totalPaginas.set(Math.ceil(ordenado.length / pageSize));
                  this.paginaAtual.set(1);
                }

                if (onFinish) onFinish();
              },
              error: error => {
                console.error('Erro ao carregar masteries do usuário:', error);
                // Em caso de erro, mostrar todos os masteries sem seleção
                const ordenado = todos.sort(
                  (a, b) => a.name.localeCompare(b.name) || a.class.name.localeCompare(b.class.name)
                );

                const pageSize = 20;
                const primeiraPagina = ordenado.slice(0, pageSize);

                this.dados.set(primeiraPagina);
                this.totalResultados.set(ordenado.length);
                this.totalPaginas.set(Math.ceil(ordenado.length / pageSize));
                this.paginaAtual.set(1);

                if (onFinish) onFinish();
              },
            });
        },
        error: error => {
          console.error('Erro ao carregar lista de masteries:', error);
          this.toastMessage.set('Erro ao carregar lista de masteries!');
          if (onFinish) onFinish();
        },
      });
  }

  buscar(
    filtros: { nome?: string; dificuldade?: string; classe?: string },
    page = 1,
    onFinish?: () => void
  ) {
    const isRare = filtros.dificuldade?.toLowerCase() === 'rare';

    // Se já temos todos os dados carregados (por exemplo, após importar o JSON)
    if (this._dadosTodos.length > 0) {
      const dadosFiltrados = this._dadosTodos.filter(item => {
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
      if (onFinish) onFinish();
      return;
    }

    const params = new URLSearchParams({
      action: 'list',
      page: isRare ? '1' : page.toString(),
      pageSize: isRare ? '9999' : '20', // busca tudo se rare
      name: filtros.nome || '',
      difficulty: isRare ? '' : filtros.dificuldade || '',
      class: filtros.classe || '',
    });

    this.http
      .post<any>(
        `${this.baseUrl}?${params.toString()}`,
        {
          action: 'list',
          page: isRare ? '1' : page.toString(),
          pageSize: isRare ? '9999' : '20', // busca tudo se rare
          name: filtros.nome || '',
          difficulty: isRare ? '' : filtros.dificuldade || '',
          class: filtros.classe || '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authService.getToken()}`,
          },
        }
      )
      .subscribe({
        next: res => {
          const filtrados = isRare
            ? res.data.filter((item: any) => item.occurrence === 'Very Rare')
            : res.data;

          const dadosFormatados = filtrados
            .map((item: any) => ({
              ...item,
              difficulty: item.occurrence === 'Very Rare' ? 'Rare' : item.difficulty,
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
          if (onFinish) onFinish();
        },
        error: error => {
          console.error('Erro ao buscar masteries:', error);
          this.toastMessage.set('Erro ao buscar masteries!');
          if (onFinish) onFinish();
        },
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
    const data = this.selecionados().map(item => ({
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
      body: masteries.map(item => [item.name, item.difficulty, item.class.name]),
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

  importarJson(file: File, onFinish?: () => void) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as any[];

        if (Array.isArray(data)) {
          const reconstruidos = data.map((m: any) => ({
            ...m,
            class: typeof m.class === 'string' ? { name: m.class } : m.class,
          }));

          // Enviar dados para o backend PRIMEIRO
          this.salvarMasteriesUsuario(
            reconstruidos,
            () => {
              // Só preenche a tela após sucesso no banco
              this.selecionados.set(reconstruidos);
              this.toastMessage.set('Masteries carregados com sucesso!');

              const selecionadosIds = new Set(reconstruidos.map(m => m.id));

              // Usar a mesma estrutura da chamada inicial para garantir consistência
              const params = new URLSearchParams({
                action: 'list',
                page: '1',
                pageSize: '9999',
                name: '',
                difficulty: '',
                class: '',
              });

              this.http
                .post<any>(
                  `${this.baseUrl}?${params.toString()}`,
                  {
                    action: 'list',
                    page: '1',
                    pageSize: '9999',
                    name: '',
                    difficulty: '',
                    class: '',
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${this.authService.getToken()}`,
                    },
                  }
                )
                .subscribe({
                  next: res => {
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
                    if (onFinish) onFinish();
                  },
                  error: error => {
                    console.error('Erro ao carregar lista de masteries:', error);
                    this.toastMessage.set('Erro ao carregar lista de masteries!');
                    if (onFinish) onFinish();
                  },
                });

              setTimeout(() => this.toastMessage.set(null), 3000);
            },
            errorMsg => {
              // Tratamento de erro para usuário não cadastrado
              if (
                errorMsg &&
                (errorMsg.includes('Usuário não cadastrado') ||
                  errorMsg.toLowerCase().includes('usuário não cadastrado') ||
                  errorMsg.includes('nao cadastrado') ||
                  errorMsg.toLowerCase().includes('nao cadastrado'))
              ) {
                // Ativar o modal de visitante
                this.showVisitorModal.set(true);
                if (onFinish) onFinish();
              } else {
                this.toastMessage.set(`Erro ao importar: ${errorMsg || 'Erro desconhecido'}`);
                if (onFinish) onFinish();
              }
            }
          );
        } else {
          this.toastMessage.set('Arquivo inválido!');
          if (onFinish) onFinish();
        }
      } catch (e) {
        this.toastMessage.set('Erro ao ler o arquivo!');
        if (onFinish) onFinish();
      }
    };
    reader.readAsText(file);
  }

  salvarSelecionados(): Promise<string | null> {
    return new Promise(resolve => {
      const selecionados = this.selecionados();
      if (selecionados.length > 0) {
        this.salvarMasteriesUsuario(selecionados, undefined, errorMsg => {
          resolve(errorMsg);
        });
      } else {
        this.toastMessage.set('Nenhum mastery selecionado para salvar!');
        resolve(null);
      }
    });
  }

  // Atualize salvarMasteriesUsuario para aceitar um callback opcional de erro
  private salvarMasteriesUsuario(
    masteries: any[],
    onSuccess?: () => void,
    onError?: (errorMsg: string | null) => void
  ) {
    const payload = {
      payload: masteries,
    };

    this.http.post<any>(`${this.userMasteryUrl}?action=save`, payload).subscribe({
      next: response => {
        // Verificar se a resposta indica erro
        if (response && response.success === false && response.message) {
          if (onError) onError(response.message);
          return;
        }

        // Verificar se a resposta indica sucesso (success: true ou status 201)
        if (response && (response.success === true || response.hash)) {
          this.toastMessage.set('Masteries salvos no servidor!');
          if (onSuccess) onSuccess();
          if (onError) onError(null);
          return;
        }

        // Caso padrão: tratar como sucesso se não for explicitamente um erro

        this.toastMessage.set('Masteries salvos no servidor!');
        if (onSuccess) onSuccess();
        if (onError) onError(null);
      },
      error: error => {
        // Se o erro tem uma mensagem no body, use ela
        if (error.error && error.error.message) {
          if (onError) onError(error.error.message);
        } else {
          this.toastMessage.set('Erro ao salvar no servidor!');
          if (onError) onError('Erro ao salvar no servidor!');
        }
      },
    });
  }

  ordenarDados(campo: 'name' | 'difficulty' | 'class.name', crescente: boolean) {
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

    const selecionadosIds = new Set(this.selecionados().map(m => m.id));

    const ordenado = [...this.dados()]
      .sort((a, b) => compare(a, b) * (crescente ? 1 : -1))
      .sort((a, b) => Number(!selecionadosIds.has(a.id)) - Number(!selecionadosIds.has(b.id)));

    this.dados.set(ordenado);
  }

  // Exemplo de salvar animous
  salvarAnimous(payload: any, token: string) {
    return this.http.post(`${this.baseUrl}?action=save`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
