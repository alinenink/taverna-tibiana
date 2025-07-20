import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { WeaponsService, WeaponCategoryType, WeaponCategory, WeaponBasic, WeaponDetailed, ProficiencyLevel } from '../../services/weapons.service';
import { ProficiencyApiService } from '../../services/proficiency-api.service';

@Component({
  selector: 'app-weapons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.scss']
})
export class WeaponsComponent implements OnInit {
  // Signals para reatividade
  categories = signal<WeaponCategory[]>([]);
  weapons = signal<WeaponBasic[]>([]);
  stats = signal<any>(null);
  currentCategory = signal<WeaponCategoryType>('swords');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Estados da interface
  showCategoryList = signal<boolean>(false);
  
  // Seção de armas salvas
  savedWeapons = signal<any[]>([]);
  showSavedWeapons = signal<boolean>(false);
  loadingSavedWeapons = signal<boolean>(false);
  
  // Loading state (mesmo padrão do animous-mastery)
  carregando: boolean = true;
  
  // Filtros
  searchTerm = '';
  selectedVocation = '';
  selectedTier = '';
  minLevel = 0;
  
  // Dados originais para filtros
  private originalWeapons: WeaponBasic[] = [];

  constructor(
    public weaponsService: WeaponsService,
    private router: Router,
    private proficiencyApiService: ProficiencyApiService
  ) {}

  ngOnInit() {
    
    this.loadCategories();
  }

  // ====================================
  // Métodos de carregamento de dados
  // ====================================

  loadCategories() {
    this.carregando = true;
    this.error.set(null);
    
    this.weaponsService.getCategories()
      .subscribe({
        next: (categories) => {
          
          
          if (categories && categories.length > 0) {
            // Verificar se as categorias esperadas estão presentes
            const categoryIds = categories.map(cat => cat.id);
            const missingCategories: WeaponCategory[] = [];

            // Adicionar categorias que estão faltando como fallbacks
            if (!categoryIds.includes('rods')) {
              missingCategories.push({
                id: 'rods',
                name: 'Rods',
                weapons_endpoint: '/api/weapons?action=list&category=rods',
                detail_endpoint: '/api/weapons?action=weapon&category=rods'
              });
              
            }

            if (!categoryIds.includes('wands')) {
              missingCategories.push({
                id: 'wands',
                name: 'Wands',
                weapons_endpoint: '/api/weapons?action=list&category=wands',
                detail_endpoint: '/api/weapons?action=weapon&category=wands'
              });
              
            }

            const finalCategories = [...categories, ...missingCategories];
            
            this.categories.set(finalCategories);
          } else {
            
            this.categories.set(this.getDefaultCategories());
          }
          
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar categorias:', error);
          
          this.categories.set(this.getDefaultCategories());
          this.error.set(null); // Não mostrar erro para o usuário se temos fallback
          this.carregando = false;
        }
      });
  }

  loadWeapons() {
    this.carregando = true;
    
    this.weaponsService.getWeaponsByCategory(this.currentCategory()).subscribe({
      next: (response) => {
        
        if (response.success && response.data) {
          const weaponsData = response.data;
          
          this.originalWeapons = weaponsData;
          this.weapons.set(weaponsData);
          
          this.loadStats();
        } else {
          console.error('Resposta inválida da API:', response);
          this.error.set('Resposta inválida da API');
        }
        
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar armas:', error);
        this.error.set(error.message);
        this.carregando = false;
      }
    });
  }

  loadStats() {
    this.weaponsService.getCategoryStats(this.currentCategory()).subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  onCategoryChange(categoryId: string) {
    
    this.currentCategory.set(categoryId as WeaponCategoryType);
    this.showCategoryList.set(true);
    this.resetFilters();
    this.carregando = true;
    this.loadWeapons();
  }

  onSearch() {
    this.applyFilters();
  }

  onVocationChange() {
    this.applyFilters();
  }

  onTierChange() {
    this.applyFilters();
  }

  onLevelChange() {
    this.applyFilters();
  }

  onBackToCategories() {
    this.showCategoryList.set(false);
    this.weapons.set([]);
    this.stats.set(null);
    this.currentCategory.set('swords'); // ou null, se preferir
    this.resetFilters();
  }

  onWeaponClick(weapon: WeaponBasic) {
    // Navegar para a página de detalhes da arma
    this.router.navigate(['/weapons', weapon.category?.id || this.currentCategory(), weapon.name]);
  }

  private resetFilters() {
    this.searchTerm = '';
    this.selectedVocation = '';
    this.selectedTier = '';
    this.minLevel = 0;
  }

  private applyFilters() {
    let filteredWeapons = [...this.originalWeapons];

    // Filtro por nome
    if (this.searchTerm.trim()) {
      filteredWeapons = filteredWeapons.filter(weapon =>
        weapon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro por vocação
    if (this.selectedVocation) {
      filteredWeapons = filteredWeapons.filter(weapon =>
        weapon.vocation.toLowerCase() === this.selectedVocation.toLowerCase() ||
        weapon.vocation.toLowerCase() === 'todas'
      );
    }

    // Filtro por tier
    if (this.selectedTier) {
      filteredWeapons = filteredWeapons.filter(weapon =>
        weapon.tier === parseInt(this.selectedTier)
      );
    }

    // Filtro por nível mínimo
    if (this.minLevel > 0) {
      filteredWeapons = filteredWeapons.filter(weapon =>
        weapon.level >= this.minLevel
      );
    }

    this.weapons.set(filteredWeapons);
  }

    getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      swords: 'assets/icons-svg/swords.svg',
      axes: 'assets/icons-svg/axes.svg',
      clavas: 'assets/icons-svg/mace.svg',
      ranged: 'assets/icons-svg/bow-and-arrow.svg',
      rods: 'assets/icons-svg/magic-wand.svg',
      wands: 'assets/icons-svg/wooden-stick.svg',
      fist: 'assets/icons-svg/protest.svg'
    };

    return icons[categoryId] || 'assets/icons-svg/swords.svg';
  }

  /**
   * Carrega ícones dos assets de forma genérica
   * Converte nomes de ícones vindos do backend para caminhos dos assets
   * @param iconName - Nome do ícone vindo do backend
   * @returns Caminho completo para o asset
   */
  getIconAssetPath(iconName: string): string {
    // Se já é um caminho completo, retorna como está
    if (iconName.startsWith('assets/') || iconName.startsWith('http')) {
      return iconName;
    }
    // Se vem do backend como 'icons/...' prefixa com 'assets/'
    if (iconName.startsWith('icons/')) {
      return `assets/${iconName}`;
    }
    // Fallback para um ícone padrão
    return 'assets/icons/32_11345f84.png';
  }

  /**
   * Carrega múltiplos ícones de uma vez
   * @param iconNames - Array de nomes de ícones
   * @returns Array de caminhos dos assets
   */
  getIconAssetPaths(iconNames: string[]): string[] {
    return iconNames.map(iconName => this.getIconAssetPath(iconName));
  }

  /**
   * Verifica se um arquivo de ícone existe
   * @param path - Caminho do arquivo
   * @returns Promise<boolean>
   */
  private async checkIconExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Carrega ícone com verificação de existência
   * @param iconName - Nome do ícone
   * @returns Promise<string> - Caminho do ícone válido
   */
  async getIconAssetPathAsync(iconName: string): Promise<string> {
    // Se já é um caminho completo, retorna como está
    if (iconName.startsWith('assets/') || iconName.startsWith('http')) {
      return iconName;
    }
    
    // Remove extensão se existir
    const nameWithoutExt = iconName.replace(/\.(png|gif|jpg|jpeg|svg)$/i, '');
    
    // Se o nome já contém underscore (formato do backend), usa como está
    if (nameWithoutExt.includes('_')) {
      const extensions = ['.png', '.gif', '.svg'];
      
      for (const ext of extensions) {
        const fullPath = `assets/icons/${nameWithoutExt}${ext}`;
        if (await this.checkIconExists(fullPath)) {
          return fullPath;
        }
      }
    }
    
    // Se não tem underscore, tenta adicionar prefixos comuns
    const prefixes = ['32_', '38_'];
    const extensions = ['.png', '.gif', '.svg'];
    
    for (const prefix of prefixes) {
      for (const ext of extensions) {
        const fullPath = `assets/icons/${prefix}${nameWithoutExt}${ext}`;
        if (await this.checkIconExists(fullPath)) {
          return fullPath;
        }
      }
    }
    
    // Fallback para um ícone padrão
    return 'assets/icons/32_11345f84.png';
  }

  getWeaponEmoji(weaponName: string): string {
    const name = weaponName.toLowerCase();
    
    // Espadas
    if (name.includes('sword') || name.includes('espada') || name.includes('blade')) return '⚔️';
    if (name.includes('rapier') || name.includes('estoc') || name.includes('foil') || name.includes('epee')) return '🤺';
    if (name.includes('sabre') || name.includes('sabre')) return '🗡️';
    if (name.includes('katana') || name.includes('katana')) return '⚔️';
    if (name.includes('scimitar') || name.includes('cimitarra')) return '⚔️';
    if (name.includes('slayer') || name.includes('slayer')) return '⚔️';
    if (name.includes('claymore') || name.includes('claymore')) return '⚔️';
    if (name.includes('longsword') || name.includes('longsword')) return '⚔️';
    
    // Machados
    if (name.includes('axe') || name.includes('machado') || name.includes('hatchet')) return '🪓';
    if (name.includes('battle axe') || name.includes('machado de batalha') || name.includes('battleaxe')) return '🪓';
    if (name.includes('war axe') || name.includes('machado de guerra') || name.includes('waraxe')) return '🪓';
    if (name.includes('greataxe') || name.includes('machado grande')) return '🪓';
    if (name.includes('chopper') || name.includes('cortador')) return '🪓';
    if (name.includes('cleaver') || name.includes('cutelo')) return '🪓';
    if (name.includes('halberd') || name.includes('alabarda')) return '🔱';
    if (name.includes('lance') || name.includes('lança')) return '🔱';
    if (name.includes('trident') || name.includes('tridente')) return '🔱';
    if (name.includes('naginata') || name.includes('naginata')) return '🔱';
    if (name.includes('scythe') || name.includes('gadanha')) return '🌾';
    if (name.includes('impaler') || name.includes('empalador')) return '��';
    
    // Clavas
    if (name.includes('club') || name.includes('clava') || name.includes('mace')) return '🏏';
    if (name.includes('morning star') || name.includes('estrela da manhã')) return '⭐';
    if (name.includes('hammer') || name.includes('martelo')) return '🔨';
    if (name.includes('war hammer') || name.includes('martelo de guerra') || name.includes('warhammer')) return '🔨';
    if (name.includes('bludgeon') || name.includes('maça')) return '🏏';
    if (name.includes('cudgel') || name.includes('porrete')) return '🏏';
    if (name.includes('flail') || name.includes('mangual')) return '⚔️';
    if (name.includes('warmace') || name.includes('maca de guerra')) return '🏏';
    if (name.includes('sceptre') || name.includes('cetro')) return '👑';
    if (name.includes('staff') || name.includes('cajado')) return '🪄';
    if (name.includes('squelcher') || name.includes('esmagador')) return '🏏';
    if (name.includes('demonbone') || name.includes('osso demoníaco')) return '💀';
    if (name.includes('truncheon') || name.includes('cassetete')) return '🏏';
    if (name.includes('klubba') || name.includes('clava')) return '🏏';
    if (name.includes('maul') || name.includes('malho')) return '🔨';
    if (name.includes('whip') || name.includes('chicote')) return '🪢';
    
    // Armas de longo alcance
    if (name.includes('bow') || name.includes('arco') || name.includes('crossbow')) return '🏹';
    if (name.includes('spear') || name.includes('lança') || name.includes('javelin')) return '🔱';
    if (name.includes('throwing') || name.includes('arremesso')) return '🎯';
    
    // Varas e cajados
    if (name.includes('rod') || name.includes('vara') || name.includes('staff')) return '🪄';
    if (name.includes('wand') || name.includes('varinha')) return '🪄';
    if (name.includes('spellbook') || name.includes('grimório')) return '📖';
    
    // Armas de punho
    if (name.includes('fist') || name.includes('punho') || name.includes('claw')) return '✊';
    if (name.includes('knuckle') || name.includes('nudillo')) return '👊';
    
    // Armas especiais
    if (name.includes('dagger') || name.includes('adaga')) return '🗡️';
    if (name.includes('knife') || name.includes('faca')) return '🔪';
    if (name.includes('sickle') || name.includes('foice')) return '🌾';
    if (name.includes('scythe') || name.includes('gadanha')) return '🌾';
    if (name.includes('hooks') || name.includes('ganchos')) return '🎣';
    
    // Por categoria (fallback)
    const category = this.currentCategory();
    if (category === 'swords') return '⚔️';
    if (category === 'axes') return '🪓';
    if (category === 'clavas') return '🏏';
    if (category === 'ranged') return '🏹';
    if (category === 'rods') return '🪄';
    if (category === 'wands') return '🪄';
    if (category === 'fist') return '✊';
    
    return '⚔️'; // Emoji padrão
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatBonusName(name: string): string {
    return name
      .split('_')
      .map(word => this.capitalizeFirst(word))
      .join(' ');
  }

  trackByWeaponName(index: number, weapon: WeaponBasic): string {
    return weapon.name;
  }

  trackByIcon(index: number, icon: string): string {
    return icon;
  }

  /**
   * Obtém a URL da imagem da arma com fallback
   * @param weapon - Objeto da arma
   * @returns URL da imagem ou emoji como fallback
   */
  getWeaponImageUrl(weapon: WeaponBasic): string {
    if (weapon.image_url) {
      // Remove o @ do início da URL se existir
      let cleanUrl = weapon.image_url;
      if (cleanUrl.startsWith('@')) {
        cleanUrl = cleanUrl.substring(1);
      }
      
      // Se é uma URL completa, usa diretamente
      if (cleanUrl.startsWith('assets/') || cleanUrl.startsWith('http')) {
        return cleanUrl;
      }
      
      // Se é apenas o nome do arquivo, busca na pasta assets/itens
      const itemImagePath = this.getItemImagePath(cleanUrl);
      if (itemImagePath) {
        return itemImagePath;
      }
      
      // Se não encontrou a imagem, usa fallback
      return this.getWeaponEmoji(weapon.name);
    }
    // Fallback para emoji se não houver image_url
    return this.getWeaponEmoji(weapon.name);
  }

  /**
   * Tenta carregar a imagem usando um proxy CORS
   * @param weapon - Objeto da arma
   * @returns URL do proxy ou URL original
   */
  getWeaponImageUrlWithProxy(weapon: WeaponBasic): string {
    if (!weapon.image_url) {
      return this.getWeaponEmoji(weapon.name);
    }

    let cleanUrl = weapon.image_url;
    if (cleanUrl.startsWith('@')) {
      cleanUrl = cleanUrl.substring(1);
    }

    // Se é uma URL externa, tenta usar um proxy CORS
    if (cleanUrl.startsWith('http') && !cleanUrl.includes('localhost')) {
      // Tenta diferentes proxies CORS
      const proxies = [
        `https://cors-anywhere.herokuapp.com/${cleanUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(cleanUrl)}`
      ];
      
      // Por enquanto, vamos tentar o primeiro proxy
      return proxies[0];
    }

    return cleanUrl;
  }

  /**
   * Tenta carregar a imagem diretamente primeiro, depois com proxy
   * @param weapon - Objeto da arma
   * @returns URL da imagem
   */
  getWeaponImageUrlDirect(weapon: WeaponBasic): string {
    // Se tem image_url, usa ela
    if (weapon.image_url) {
      const imagePath = this.getItemImagePath(weapon.image_url);
      if (imagePath) {
        return imagePath;
      }
    }

    // Fallback para emoji
    return this.getWeaponEmoji(weapon.name);
  }

  /**
   * Converte o nome do item retornado pela API para o caminho da imagem
   * @param itemName - Nome do item retornado pela API (ex: "Amber_Sabre" ou "local://Amber_Sabre")
   * @returns Caminho da imagem ou null se não encontrado
   */
  getItemImagePath(itemName: string): string | null {
    if (!itemName) return null;

    // Remove o prefixo "local://" se existir
    const cleanName = itemName.replace(/^local:\/\//, '');
    
    // Verifica se o arquivo termina com extensão
    if (cleanName.endsWith('.webp') || cleanName.endsWith('.gif')) {
      // Se já tem extensão, usa diretamente
      if (cleanName.endsWith('.gif')) {
        return `assets/sprites/loot/${cleanName}`;
      } else {
        return `assets/itens/${cleanName}`;
      }
    } else {
      // Se não tem extensão, tenta adivinhar baseado no nome
      // Lista de arquivos que sabemos que são .gif
      const gifFiles = [
        'Butcher\'s_Axe',
        'The_Imperor\'s_Trident',
        'The_Plasmother\'s_Remains',
        'The_Stomper',
        'Thunder_Hammer',
        'Trapped_Lightning',
        'Triple_Bolt_Crossbow',
        'The_Devileye',
        'The_Handmaiden\'s_Protector',
        'Yol\'s_Bow'
      ];
      
      if (gifFiles.includes(cleanName)) {
        return `assets/sprites/loot/${cleanName}.gif`;
      } else {
        // Por padrão, tenta .webp primeiro
        return `assets/itens/${cleanName}.webp`;
      }
    }
  }

  /**
   * Encontra um nome similar na lista de itens disponíveis
   * @param searchName - Nome a ser procurado
   * @param availableNames - Lista de nomes disponíveis
   * @returns Nome similar encontrado ou null
   */
  private findSimilarItemName(searchName: string, availableNames: string[]): string | null {
    const searchLower = searchName.toLowerCase();
    
    // Primeiro, tenta encontrar por substring
    for (const name of availableNames) {
      if (name.toLowerCase().includes(searchLower) || searchLower.includes(name.toLowerCase())) {
        return name;
      }
    }
    
    // Se não encontrou, tenta por similaridade de palavras
    const searchWords = searchLower.split(/[\s_]+/);
    for (const name of availableNames) {
      const nameWords = name.toLowerCase().split(/[\s_]+/);
      const commonWords = searchWords.filter(word => nameWords.includes(word));
      if (commonWords.length >= Math.min(searchWords.length, nameWords.length) * 0.7) {
        return name;
      }
    }
    
    return null;
  }

  /**
   * Verifica se a arma tem uma imagem válida
   * @param weapon - Objeto da arma
   * @returns true se tem image_url válida
   */
  hasWeaponImage(weapon: WeaponBasic): boolean {
    if (!weapon.image_url || weapon.image_url.trim() === '') {
      return false;
    }
    
    // Remove o @ do início da URL se existir
    let cleanUrl = weapon.image_url.trim();
    if (cleanUrl.startsWith('@')) {
      cleanUrl = cleanUrl.substring(1);
    }
    
    // Se é uma URL completa, verifica se é válida
    if (cleanUrl.startsWith('assets/') || cleanUrl.startsWith('http')) {
      return true;
    }
    
    // Se é apenas o nome do arquivo, verifica se existe mapeamento
    const itemImagePath = this.getItemImagePath(cleanUrl);
    return itemImagePath !== null;
  }

  /**
   * Trata erro de carregamento de imagem
   * @param event - Evento de erro
   * @param weapon - Objeto da arma
   */
  onImageError(event: any, weapon: WeaponBasic): void {
    console.warn(`Erro ao carregar imagem para ${weapon.name}:`, event);
    
    const failedUrl = event.target.src;
    
    // Se a URL que falhou termina com .webp, tenta .gif
    if (failedUrl.endsWith('.webp')) {
      const gifUrl = failedUrl.replace('.webp', '.gif');
      event.target.src = gifUrl;
      return;
    }
    
    // Se a URL que falhou termina com .gif, tenta .webp
    if (failedUrl.endsWith('.gif')) {
      const webpUrl = failedUrl.replace('.gif', '.webp');
      event.target.src = webpUrl;
      return;
    }
    
    // Se não conseguiu carregar nenhuma extensão, usa emoji
    weapon.image_url = '';
  }

  /**
   * Trata carregamento bem-sucedido de imagem
   * @param event - Evento de load
   * @param weapon - Objeto da arma
   */
  onImageLoad(event: any, weapon: WeaponBasic): void {
    
  }

  private getDefaultCategories(): WeaponCategory[] {
    return [
      {
        id: 'swords',
        name: 'Espadas',
        weapons_endpoint: '/api/weapons?action=list&category=swords',
        detail_endpoint: '/api/weapons?action=weapon&category=swords'
      },
      {
        id: 'axes',
        name: 'Machados',
        weapons_endpoint: '/api/weapons?action=list&category=axes',
        detail_endpoint: '/api/weapons?action=weapon&category=axes'
      },
      {
        id: 'clavas',
        name: 'Clavas',
        weapons_endpoint: '/api/weapons?action=list&category=clavas',
        detail_endpoint: '/api/weapons?action=weapon&category=clavas'
      },
      {
        id: 'ranged',
        name: 'Armas de Longo Alcance',
        weapons_endpoint: '/api/weapons?action=list&category=ranged',
        detail_endpoint: '/api/weapons?action=weapon&category=ranged'
      },
      {
        id: 'rods',
        name: 'Rods',
        weapons_endpoint: '/api/weapons?action=list&category=rods',
        detail_endpoint: '/api/weapons?action=weapon&category=rods'
      },
      {
        id: 'wands',
        name: 'Wands',
        weapons_endpoint: '/api/weapons?action=list&category=wands',
        detail_endpoint: '/api/weapons?action=weapon&category=wands'
      },
      {
        id: 'fist',
        name: 'Armas de Punho',
        weapons_endpoint: '/api/weapons?action=list&category=fist',
        detail_endpoint: '/api/weapons?action=weapon&category=fist'
      }
    ];
  }

  // ====================================
  // Seção de Armas Salvas
  // ====================================

  showSavedWeaponsSection() {
    this.showSavedWeapons.set(true);
    this.showCategoryList.set(false);
    this.loadSavedWeapons();
  }

  hideSavedWeaponsSection() {
    this.showSavedWeapons.set(false);
    this.showCategoryList.set(false);
  }

  async loadSavedWeapons() {
    this.loadingSavedWeapons.set(true);
    this.error.set(null);

    try {
      const response = await this.proficiencyApiService.list();
      
      if (response.success && response.data) {
        this.savedWeapons.set(response.data);
        console.log('Armas salvas carregadas:', response.data);
      } else {
        this.savedWeapons.set([]);
        console.log('Nenhuma arma salva encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar armas salvas:', error);
      this.error.set('Erro ao carregar suas armas salvas. Tente novamente.');
      this.savedWeapons.set([]);
    } finally {
      this.loadingSavedWeapons.set(false);
    }
  }

  onSavedWeaponClick(savedWeapon: any) {
    // Navegar para a tela de detail da arma salva
    this.router.navigate(['/weapons', savedWeapon.weapon_category, savedWeapon.weapon_name]);
  }

  formatSavedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
} 