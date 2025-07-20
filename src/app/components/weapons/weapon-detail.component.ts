import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WeaponsService } from '../../services/weapons.service';
import { AnalyticsService } from '../../services/analytics.service';

interface WeaponLevel {
  level: number;
  perks: Array<{
    icons: string[];
    description: string;
    title: string;
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
  weapon: WeaponDetail | null = null;
  carregando = true;
  error: string | null = null;

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
    this.carregando = true;
    this.error = null;

    // Buscar dados reais da API
    this.weaponsService.getWeaponDetails(category as any, decodeURIComponent(name))
      .subscribe({
        next: (response) => {
          
          if (response.success && response.weapon) {
            // Converter dados da API para o formato do componente
            this.weapon = {
              name: response.weapon.name,
              category: response.category.id,
              image_url: `assets/itens/${response.weapon.name}.webp`, // Fallback para imagem
              levels: this.convertProficiencyLevels(response.weapon.proficiency?.levels || [])
            };
          } else {
            this.error = response.message || 'Erro ao carregar detalhes da arma';
          }
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes da arma:', error);
          this.error = 'Erro ao carregar detalhes da arma. Tente novamente.';
          this.carregando = false;
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

    return apiLevels.map(apiLevel => ({
      level: apiLevel.level,
      perks: apiLevel.perks || [],
      selectedPerk: undefined
    }));
  }

  onPerkSelect(level: WeaponLevel, perk: any) {
    // Se já tem uma perk selecionada neste nível, desmarca
    if (level.selectedPerk === perk.title) {
      level.selectedPerk = undefined;
    } else {
      // Se tem outra perk selecionada, substitui
      level.selectedPerk = perk.title;
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
    return !!(this.weapon?.levels && this.weapon.levels.length > 0);
  }



  onIconError(event: any) {
    console.warn('Erro ao carregar ícone da proficiência:', event);
    event.target.style.display = 'none';
  }
} 