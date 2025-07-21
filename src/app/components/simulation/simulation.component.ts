import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss',
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class SimulationComponent implements OnInit {
  charName = '';
  activeTab: 'achievements' | 'outfits' | 'mounts' | 'quests' = 'achievements';
  achievements = [
    { name: 'Cavebaiting', checked: false },
    { name: 'Fountain of Blessings', checked: false },
    { name: 'Interior Decorator', checked: false },
    { name: 'Warlord of Svargrond', checked: false },
  ];

  outfits = [
    { name: 'Elite Hunter', addons: 'Addon 1, Addon 2', checked: false },
    { name: 'Oriental', addons: 'Addon 1', checked: false },
    { name: 'Soil Guardian', addons: 'Base Only', checked: false },
  ];

  mounts = [
    { name: 'Midnight Panther', type: 'Domável', checked: false },
    { name: 'Draptor', type: 'Quest', checked: false },
    { name: 'Crystal Wolf', type: 'Evento', checked: false },
  ];

  quests = [
    { name: 'Annihilator', checked: false },
    { name: 'Secret of the Shoals', checked: false },
    { name: 'In Service of Yalahar', checked: false },
  ];

  carregando: boolean = true;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private scrollService: ScrollService
  ) {
    setTimeout(() => {
      this.carregando = false;
    }, 2000);
  }

  ngOnInit(): void {
    this.scrollService.scrollToTop();
  }

  get achvProgress(): number {
    return this.calcProgress(this.achievements);
  }

  get outfitProgress(): number {
    return this.calcProgress(this.outfits);
  }

  get totalProgress(): number {
    const total =
      this.achievements.length +
      this.outfits.length +
      this.mounts.length +
      this.quests.length;
    const done =
      this.countChecked(this.achievements) +
      this.countChecked(this.outfits) +
      this.countChecked(this.mounts) +
      this.countChecked(this.quests);
    return Math.round((done / total) * 100);
  }

  setTab(tab: 'achievements' | 'outfits' | 'mounts' | 'quests') {
    this.activeTab = tab;
    // Track tab selection
    this.analyticsService.trackSimulationUsage('tab_selection', { tab: tab });
  }

  onStartSimulation() {
    // Track simulation start
    this.analyticsService.trackSimulationUsage('start', { 
      charName: this.charName,
      totalProgress: this.totalProgress 
    });
    
  }

  exportToJson() {
    // Track export action
    this.analyticsService.trackSimulationUsage('export_json', { 
      charName: this.charName,
      totalProgress: this.totalProgress 
    });
    
    const data = {
      charName: this.charName,
      achievements: this.achievements,
      outfits: this.outfits,
      mounts: this.mounts,
      quests: this.quests,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.charName || 'charlover'}-simulacao.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromJson() {
    // Track import action
    this.analyticsService.trackSimulationUsage('import_json', {});
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          this.charName = data.charName || '';
          this.achievements = data.achievements || [];
          this.outfits = data.outfits || [];
          this.mounts = data.mounts || [];
          this.quests = data.quests || [];
          
          // Track successful import
          this.analyticsService.trackSimulationUsage('import_success', { 
            charName: this.charName 
          });
        } catch (e) {
          alert('Erro ao importar arquivo.');
          // Track import error
          this.analyticsService.trackSimulationUsage('import_error', { error: 'parse_error' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  exportToPdf() {
    alert('Função de exportar para PDF ainda será implementada.');
  }

  private calcProgress(list: { checked: boolean }[]): number {
    return Math.round((this.countChecked(list) / list.length) * 100);
  }

  private countChecked(list: { checked: boolean }[]): number {
    return list.filter((i) => i.checked).length;
  }
}
