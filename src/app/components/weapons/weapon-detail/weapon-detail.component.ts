import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { WeaponsService } from '../../../services/weapons.service';
import { AnalyticsService } from '../../../services/analytics.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public weaponsService: WeaponsService
  ) {
  }

  ngOnInit() {
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
            this.weapon.set({
              name: response.weapon.name,
              category: response.category.id,
              image_url: `assets/itens/${response.weapon.name}.webp`, // Fallback para imagem
              levels: this.convertProficiencyLevels(response.weapon.proficiency?.levels || [])
            });
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



  voltarParaLista() {
    this.router.navigate(['/weapons']);
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
} 