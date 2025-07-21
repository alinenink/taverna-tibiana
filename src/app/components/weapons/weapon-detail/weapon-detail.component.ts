import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { WeaponsService } from '../../../services/weapons.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { ProficiencyApiService } from '../../../services/proficiency-api.service';
import { ScrollService } from '../../../services/scroll.service';

interface WeaponLevel {
  level: number;
  perks: Array<{
    icons: string[];
    description: string;
    title: string;
    enabled?: boolean;
    selected?: boolean;
  }>;
  selectedPerk?: string;
}

interface WeaponDetail {
  name: string;
  category: string;
  levels: WeaponLevel[];
  image_url?: string;
}

@Component({
  selector: 'app-weapon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.scss']
})
export class WeaponDetailComponent implements OnInit {
  // Angular Signals para estado reativo
  weapon = signal<WeaponDetail | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // Signal para gerenciar seleções das perks (nível → índice da perk selecionada)
  selectedPerks = signal<{ [level: number]: number }>({});

  // Signals para API e feedback
  saving = signal<boolean>(false);
  saveMessage = signal<string | null>(null);
  saveSuccess = signal<boolean>(false);
  
  // Signals para exclusão
  deleting = signal<boolean>(false);
  deleteMessage = signal<string | null>(null);
  deleteSuccess = signal<boolean>(false);
  
  // Signal para controlar o modal de confirmação de exclusão
  showDeleteConfirmationModal = signal<boolean>(false);
  
  // Signal para controlar o modal de visitante
  showVisitorModal = signal<boolean>(false);
  visitorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public weaponsService: WeaponsService,
    private proficiencyApiService: ProficiencyApiService,
    private authService: AuthService,
    private scrollService: ScrollService
  ) {
  }

  ngOnInit() {
    this.scrollService.scrollToTop();
    this.route.params.subscribe(params => {
      const category = params['category'];
      const name = params['name'];
      this.loadWeaponDetail(category, name);
    });
  }

  loadWeaponDetail(category: string, name: string) {
    this.loading.set(true);
    this.error.set(null);

    // Buscar dados reais da API
    this.weaponsService.getWeaponDetails(category as any, decodeURIComponent(name))
      .subscribe({
        next: (response) => {
          
          if (response.success && response.weapon) {
            // Converter dados da API para o formato do componente
            const weaponDetail = {
              name: response.weapon.name,
              category: response.category.id,
              image_url: `assets/itens/${response.weapon.name}.webp`, // Fallback para imagem
              levels: this.convertProficiencyLevels(response.weapon.proficiency?.levels || [])
            };
            
            this.weapon.set(weaponDetail);
            
            // Carregar perks salvas do usuário para esta arma
            this.loadSavedPerks(weaponDetail.name, weaponDetail.category);
          } else {
            this.error.set(response.message || 'Erro ao carregar detalhes da arma');
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes da arma:', error);
          this.error.set('Erro ao carregar detalhes da arma. Tente novamente.');
          this.loading.set(false);
        }
      });
  }

  generateWeaponLevels(): WeaponLevel[] {
    // Gerar níveis de proficiência (exemplo para Sanguine Rod)
    return [
      { 
        level: 1, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+1% de dano mágico' }
        ] 
      },
      { 
        level: 2, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+2% de dano mágico' },
          { icons: ['32_9e923ff4'], description: 'Aumenta chance de crítico', title: '+1% de chance de crítico' }
        ] 
      },
      { 
        level: 3, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+3% de dano mágico' },
          { icons: ['32_9e923ff4'], description: 'Aumenta chance de crítico', title: '+2% de chance de crítico' }
        ] 
      },
      { 
        level: 4, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+4% de dano mágico' },
          { icons: ['32_9e923ff4'], description: 'Aumenta chance de crítico', title: '+3% de chance de crítico' },
          { icons: ['32_3d470603'], description: 'Aumenta velocidade de cast', title: '+1% de velocidade de cast' }
        ] 
      },
      { 
        level: 5, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+5% de dano mágico' },
          { icons: ['32_9e923ff4'], description: 'Aumenta chance de crítico', title: '+4% de chance de crítico' },
          { icons: ['32_3d470603'], description: 'Aumenta velocidade de cast', title: '+2% de velocidade de cast' }
        ] 
      },
      { 
        level: 6, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+6% de dano mágico' },
          { icons: ['32_9e923ff4'], description: 'Aumenta chance de crítico', title: '+5% de chance de crítico' },
          { icons: ['32_3d470603'], description: 'Aumenta velocidade de cast', title: '+3% de velocidade de cast' },
          { icons: ['32_079dabfd'], description: 'Aumenta resistência mágica', title: '+1% de resistência mágica' }
        ] 
      },
      { 
        level: 7, 
        perks: [
          { icons: ['32_11345f84'], description: 'Aumenta o dano mágico', title: '+7% de dano mágico' },
          { icons: ['32_9e923ff4'], description: 'Aumenta chance de crítico', title: '+6% de chance de crítico' },
          { icons: ['32_3d470603'], description: 'Aumenta velocidade de cast', title: '+4% de velocidade de cast' },
          { icons: ['32_079dabfd'], description: 'Aumenta resistência mágica', title: '+2% de resistência mágica' },
          { icons: ['32_11345f84'], description: 'Habilidade especial', title: 'Habilidade especial: Sanguine Burst' }
        ] 
      }
    ];
  }

  convertProficiencyLevels(apiLevels: any[]): WeaponLevel[] {
    // Converter níveis da API para o formato do componente
    if (!apiLevels || apiLevels.length === 0) {
      // Se não há dados da API, usar dados mockados como fallback
      return this.generateWeaponLevels();
    }

    return apiLevels.map((apiLevel, levelIndex) => ({
      level: apiLevel.level,
      perks: (apiLevel.perks || []).map((perk, perkIndex) => ({
        ...perk,
        enabled: levelIndex === 0, // Todo o primeiro nível inicia habilitado
        selected: false
      })),
      selectedPerk: undefined
    }));
  }

  onPerkSelect(level: WeaponLevel, perk: any, perkIndex: number) {
    // Verificar se a perk está habilitada
    if (!perk.enabled) {
      return;
    }

    const currentWeapon = this.weapon();
    if (!currentWeapon) return;

    // Encontrar o índice do nível atual
    const levelIndex = currentWeapon.levels.findIndex(l => l.level === level.level);
    if (levelIndex === -1) return;

    // Se a perk já está selecionada, desselecioná-la
    if (perk.selected) {
      perk.selected = false;
      level.selectedPerk = undefined;
      
      // Desabilitar níveis posteriores quando não há perk selecionada no nível
      this.disableSubsequentLevels(levelIndex);
    } else {
      // Limpar outras seleções no mesmo nível (apenas uma por vez)
      level.perks.forEach(p => p.selected = false);
      
      // Selecionar a perk atual
      perk.selected = true;
      level.selectedPerk = perk.description;
      
      // Habilitar o próximo nível
      this.enableNextLevel(levelIndex);
    }

    // Atualizar o signal para reatividade
    this.weapon.set({...currentWeapon});
  }

  private disableSubsequentLevels(currentLevelIndex: number) {
    const currentWeapon = this.weapon();
    if (!currentWeapon) return;

    // Desabilitar todas as perks dos níveis posteriores
    for (let levelIdx = currentLevelIndex + 1; levelIdx < currentWeapon.levels.length; levelIdx++) {
      const level = currentWeapon.levels[levelIdx];
      level.selectedPerk = undefined;
      level.perks.forEach(perk => {
        perk.enabled = false;
        perk.selected = false;
      });
    }
  }

  private enableNextLevel(currentLevelIndex: number) {
    const currentWeapon = this.weapon();
    if (!currentWeapon) return;

    // Habilitar todas as perks do próximo nível
    if (currentLevelIndex + 1 < currentWeapon.levels.length) {
      const nextLevel = currentWeapon.levels[currentLevelIndex + 1];
      nextLevel.perks.forEach(perk => {
        perk.enabled = true;
      });
    }
  }

  hasSelectedPerks(): boolean {
    const currentWeapon = this.weapon();
    if (!currentWeapon) return false;

    return currentWeapon.levels.some(level => 
      level.perks.some(perk => perk.selected)
    );
  }

  async salvarSelecionados(): Promise<void> {
    const currentWeapon = this.weapon();
    if (!currentWeapon) return;

    // Verificar se há perks selecionadas
    if (!this.hasSelectedPerks()) {
      this.saveMessage.set('Selecione pelo menos uma proficiência antes de salvar.');
      this.saveSuccess.set(false);
      this.clearSaveMessage();
      return;
    }

    this.saving.set(true);
    this.saveMessage.set(null);

    try {
      // Coletar perks selecionadas
      const selectedPerks = currentWeapon.levels.map(level => ({
        level: level.level,
        selectedPerks: level.perks
          .filter(perk => perk.selected)
          .map(perk => ({
            icons: perk.icons,
            description: perk.description,
            title: perk.title
          }))
      })).filter(level => level.selectedPerks.length > 0);

      // Criar objeto do build
      const weaponBuild = {
        weapon: {
          name: currentWeapon.name,
          category: currentWeapon.category,
          image_url: currentWeapon.image_url
        },
        selectedPerks: selectedPerks,
        createdAt: new Date().toISOString(),
        version: '1.0'
      };

      // Enviar para a API
      const response = await this.proficiencyApiService.save(weaponBuild);

      if (response.success) {
        this.saveMessage.set(response.message || 'Proficiência salva com sucesso!');
        this.saveSuccess.set(true);
        console.log('Build salvo na API:', response.data);
      } else {
        // Verificar se é erro de usuário não cadastrado
        console.log('Resposta da API (erro):', response);
        if (response.message && 
            (response.message.includes('Usuário não cadastrado') || 
             response.message.toLowerCase().includes('usuário não cadastrado') ||
             response.message.includes('nao cadastrado') ||
             response.message.toLowerCase().includes('nao cadastrado') ||
             response.message.includes('Realize o cadastro'))) {
          console.log('Detectado usuário não cadastrado, exibindo modal...');
          console.log('Mensagem da API:', response.message);
          this.visitorMessage.set('Percebi que você está tentando salvar suas maestrias de armas como visitante! Se você quer desfrutar de todas as funcionalidades da Taverna, é preciso se registrar!');
          this.showVisitorModal.set(true);
          console.log('Modal de visitante ativado:', this.showVisitorModal());
          console.log('Mensagem do visitante:', this.visitorMessage());
        } else {
          this.saveMessage.set('Erro ao salvar: ' + (response.message || 'Erro desconhecido'));
          this.saveSuccess.set(false);
        }
      }

    } catch (error: any) {
      console.error('Erro ao salvar proficiência:', error);
      
      // Verificar se é erro de usuário não cadastrado
      if (error.error && error.error.message && 
          (error.error.message.includes('Usuário não cadastrado') || 
           error.error.message.toLowerCase().includes('usuário não cadastrado') ||
           error.error.message.includes('nao cadastrado') ||
           error.error.message.toLowerCase().includes('nao cadastrado') ||
           error.error.message.includes('Realize o cadastro'))) {
        console.log('Detectado usuário não cadastrado no catch, exibindo modal...');
        this.visitorMessage.set('Percebi que você está tentando salvar suas maestrias de armas como visitante! Se você quer desfrutar de todas as funcionalidades da Taverna, é preciso se registrar!');
        this.showVisitorModal.set(true);
      } else {
        this.saveMessage.set('Erro de conexão. Verifique sua internet e tente novamente.');
        this.saveSuccess.set(false);
      }
    } finally {
      this.saving.set(false);
      // Só limpa a mensagem se não for modal de visitante
      if (!this.showVisitorModal()) {
        this.clearSaveMessage();
      }
    }
  }



  private async loadSavedPerks(weaponName: string, weaponCategory: string): Promise<void> {
    try {
      const response = await this.proficiencyApiService.get(weaponName, weaponCategory);
      
      if (response.success && response.data) {
        const savedData = response.data.proficiency_data;
        
        if (savedData && savedData.selectedPerks) {
          this.applySavedPerks(savedData.selectedPerks);
          console.log('Perks carregadas:', savedData.selectedPerks);
        }
      }
      // Se não houver dados salvos ou erro, não mostra mensagem (comportamento silencioso)
    } catch (error) {
      // Erro silencioso - não mostra para o usuário se não houver perks salvas
      console.log('Nenhuma proficiência salva encontrada para esta arma');
    }
  }

  private applySavedPerks(savedPerks: Array<{ level: number; selectedPerks: any[] }>): void {
    const currentWeapon = this.weapon();
    if (!currentWeapon) return;

    // Limpar seleções atuais
    currentWeapon.levels.forEach(level => {
      level.perks.forEach(perk => {
        perk.selected = false;
        perk.enabled = level.level === 1; // Resetar estado habilitado
      });
      level.selectedPerk = undefined;
    });

    // Aplicar seleções salvas
    savedPerks.forEach(savedLevel => {
      const level = currentWeapon.levels.find(l => l.level === savedLevel.level);
      if (level && savedLevel.selectedPerks.length > 0) {
        // Habilitar o nível
        level.perks.forEach(perk => perk.enabled = true);
        
        // Aplicar seleções
        savedLevel.selectedPerks.forEach(savedPerk => {
          const perk = level.perks.find(p => 
            p.description === savedPerk.description && p.title === savedPerk.title
          );
          if (perk) {
            perk.selected = true;
            level.selectedPerk = perk.description;
          }
        });

        // Habilitar próximo nível se houver seleção
        const levelIndex = currentWeapon.levels.findIndex(l => l.level === savedLevel.level);
        if (levelIndex !== -1 && levelIndex + 1 < currentWeapon.levels.length) {
          const nextLevel = currentWeapon.levels[levelIndex + 1];
          nextLevel.perks.forEach(perk => perk.enabled = true);
        }
      }
    });

    // Atualizar o signal
    this.weapon.set({...currentWeapon});
  }

  private clearSaveMessage(): void {
    setTimeout(() => {
      this.saveMessage.set(null);
      this.saveSuccess.set(false);
    }, 4000);
  }


  voltarParaLista() {
    // Capturar query parameters para determinar a origem
    const queryParams = this.route.snapshot.queryParams;
    const from = queryParams['from'];
    const category = queryParams['category'];

    if (from === 'saved-weapons') {
      // Volta para a seção de armas salvas
      this.router.navigate(['/weapons'], {
        queryParams: { showSaved: 'true' }
      });
    } else if (from === 'category-list' && category) {
      // Volta para a lista da categoria específica
      this.router.navigate(['/weapons'], {
        queryParams: { 
          category: category,
          showList: 'true'
        }
      });
    } else {
      // Fallback: volta para a tela principal de weapons
    this.router.navigate(['/weapons']);
    }
  }

  getWeaponImagePath(itemName: string): string | null {
    if (!itemName) return null;
    const cleanName = itemName.replace(/^local:\/\//, '');
    
    if (cleanName.endsWith('.webp') || cleanName.endsWith('.gif')) {
      if (cleanName.endsWith('.gif')) {
        return `assets/sprites/loot/${cleanName}`;
      } else {
        return `assets/itens/${cleanName}`;
      }
    } else {
      return `assets/itens/${cleanName}.webp`;
    }
  }

  onImageError(event: any) {
    console.warn('Erro ao carregar imagem da arma:', event);
    event.target.style.display = 'none';
  }

  getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'swords': 'Espadas',
      'axes': 'Machados',
      'clavas': 'Clavas',
      'ranged': 'Armas de Longo Alcance',
      'rods': 'Rods',
      'wands': 'Wands',
      'fist': 'Armas de Punho'
    };
    return categoryNames[category] || category;
  }

  get hasProficiencies(): boolean {
    const currentWeapon = this.weapon();
    return !!(currentWeapon?.levels && currentWeapon.levels.length > 0);
  }



  onIconError(event: any) {
    console.warn('Erro ao carregar ícone da proficiência:', event);
    event.target.style.display = 'none';
  }

  // ====================================
  // Métodos para exclusão de proficiência
  // ====================================

  openDeleteConfirmationModal(): void {
    this.showDeleteConfirmationModal.set(true);
  }

  closeDeleteConfirmationModal(event?: MouseEvent): void {
    // Se o evento foi passado, verificar se foi clicado no backdrop
    if (event && event.target !== event.currentTarget) {
      return;
    }
    this.showDeleteConfirmationModal.set(false);
  }

  async confirmarExclusao(): Promise<void> {
    if (!this.weapon()) {
      return;
    }

    const weaponName = this.weapon()!.name;
    const weaponCategory = this.weapon()!.category;

    // Fechar o modal
    this.showDeleteConfirmationModal.set(false);
    
    // Executar a exclusão
    await this.excluirProficiencia(weaponName, weaponCategory);
  }

  async excluirProficiencia(weaponName: string, weaponCategory: string): Promise<void> {
    this.deleting.set(true);
    this.deleteMessage.set(null);
    this.deleteSuccess.set(false);

    try {
      console.log(`Iniciando exclusão da proficiência: ${weaponName} (${weaponCategory})`);
      
      const response = await this.proficiencyApiService.delete(weaponName, weaponCategory);
      
      if (response.success) {
        console.log('✅ Proficiência deletada com sucesso:', response);
        this.deleteSuccess.set(true);
        this.deleteMessage.set('Proficiência excluída com sucesso!');
        
        // Limpar completamente as seleções das perks
        this.clearAllPerkSelections();
        
        // Limpar seleções locais
        this.selectedPerks.set({});
        
        // Recarregar perks salvas (deve retornar vazio agora)
        await this.loadSavedPerks(weaponName, weaponCategory);
        
        // Redirecionar para a seção de armas domadas após 2 segundos
        setTimeout(() => {
          this.clearDeleteMessage();
          this.voltarParaLista();
        }, 2000);
        
      } else {
        console.error('❌ Erro ao deletar proficiência:', response);
        this.deleteSuccess.set(false);
        this.deleteMessage.set(response.message || 'Erro ao excluir proficiência');
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => {
          this.clearDeleteMessage();
        }, 5000);
      }
      
    } catch (error) {
      console.error('❌ Erro de rede ao deletar proficiência:', error);
      this.deleteSuccess.set(false);
      this.deleteMessage.set('Erro de conexão ao excluir proficiência. Tente novamente.');
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => {
        this.clearDeleteMessage();
      }, 5000);
    } finally {
      this.deleting.set(false);
    }
  }

  private clearAllPerkSelections(): void {
    const currentWeapon = this.weapon();
    if (!currentWeapon) return;

    // Limpar todas as seleções de perks
    currentWeapon.levels.forEach(level => {
      level.perks.forEach(perk => {
        perk.selected = false;
        // Manter apenas o primeiro nível habilitado
        perk.enabled = level.level === 1;
      });
      level.selectedPerk = undefined;
    });

    // Atualizar o signal para reatividade
    this.weapon.set({...currentWeapon});
  }

  private clearDeleteMessage(): void {
    this.deleteMessage.set(null);
    this.deleteSuccess.set(false);
  }

  // ====================================
  // Métodos para modal de visitante
  // ====================================

  closeVisitorModal(): void {
    this.showVisitorModal.set(false);
    this.visitorMessage.set('');
  }

  goToRegister(): void {
    this.closeVisitorModal();
    // Limpar session local antes de ir para register
    this.authService.logout();
    this.router.navigate(['/register']);
  }
} 