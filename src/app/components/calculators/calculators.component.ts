import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalculatorsService } from '../../services/calculators.service';
import { AnalyticsService } from '../../services/analytics.service';

interface ExerciseWeaponsResult {
  weaponsRequired: {
    regular: number;
    durable: number;
    lasting: number;
  };
  cost: {
    gold: number;
    tc: number;
    seconds: number;
  };
  timeRequired: string;
  skillPointsRequired: number;
}

interface TimeValue {
  hours: number;
  minutes: number;
  time: string; // 'HH:MM'
  seconds: number;
}

function time2Seconds(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (isNaN(hours) ? 0 : hours) * 3600 + (isNaN(minutes) ? 0 : minutes) * 60;
}

function toTimeValue(time: string): TimeValue {
  const [h, m] = time.split(':');
  const hours = Math.max(0, Math.min(42, Number(h) || 0));
  let minutes = Math.max(0, Math.min(59, Number(m) || 0));
  if (hours === 42) minutes = 0; // regra especial
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return {
    hours,
    minutes,
    time: timeStr,
    seconds: hours * 3600 + minutes * 60,
  };
}

@Component({
  selector: 'app-calculators',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.scss']
})
export class CalculatorsComponent {
  carregando: boolean = false;
  activeCalculator: any = null;

  // Exercise Weapons Calculator
  exerciseWeaponForm = {
    vocation: 'knight',
    skill: 'melee',
    currentSkill: 100,
    targetSkill: 110,
    percentageLeft: 50,
    loyaltyBonus: 0,
    hasDummy: false,
    isDouble: false,
    weaponType: 'auto',
  };
  exerciseWeaponsResult: ExerciseWeaponsResult | null = null;
  exerciseWeaponsError: string | null = null;
  isLoadingExercise: boolean = false;

  // Stamina Calculator
  staminaForm = {
    currentStaminaStr: '',
    targetStaminaStr: ''
  };
  staminaErrorCurrent: boolean = false;
  staminaErrorTarget: boolean = false;
  staminaResult: any = null;
  staminaError: string | null = null;
  isLoadingStamina: boolean = false;

  staminaCurrent: TimeValue = toTimeValue('');
  staminaTarget: TimeValue = toTimeValue('');
  staminaCurrentRaw: string = '';
  staminaTargetRaw: string = '';

  staminaInvalid: boolean = false;

  // Utilitário para converter hh:mm para segundos
  private parseStaminaStr(str: string): number {
    if (!str) return 0;
    const match = str.match(/^([0-3]?\d|4[0-2]):([0-5][0-9])$/);
    if (!match) return NaN;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 * 60 + minutes * 60;
  }

  // Formata e valida o input de stamina
  formatStaminaInput(type: 'current' | 'target') {
    let value = type === 'current' ? this.staminaForm.currentStaminaStr : this.staminaForm.targetStaminaStr;
    // Se vazio, não faz nada
    if (!value) {
      if (type === 'current') this.staminaForm.currentStaminaStr = '';
      else this.staminaForm.targetStaminaStr = '';
      return;
    }
    // Completa com zeros à direita se necessário
    if (value.length < 4) value = value.padEnd(4, '0');
    // Aplica a máscara
    if (value.length >= 3) {
      value = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    if (type === 'current') this.staminaForm.currentStaminaStr = value;
    else this.staminaForm.targetStaminaStr = value;

    // Validação
    const seconds = this.parseStaminaStr(value);
    const maxSeconds = 42 * 60 * 60;
    const minSeconds = 0;
    if (isNaN(seconds) || seconds < minSeconds || seconds > maxSeconds) {
      if (type === 'current') this.staminaErrorCurrent = true;
      else this.staminaErrorTarget = true;
    } else {
      if (type === 'current') this.staminaErrorCurrent = false;
      else this.staminaErrorTarget = false;
    }

    // Validação cruzada: desejado >= atual
    const currentSeconds = this.parseStaminaStr(this.staminaForm.currentStaminaStr);
    const targetSeconds = this.parseStaminaStr(this.staminaForm.targetStaminaStr);
    if (!isNaN(currentSeconds) && !isNaN(targetSeconds)) {
      if (targetSeconds < currentSeconds) {
        this.staminaErrorTarget = true;
      }
    }
  }

  // Charm Damage Calculator
  charmDamageForm = {
    averageDamage: 0,
    creatureHp: 0,
    bonusResistance: 0,
    powerful: false
  };
  charmDamageResult: any = null;
  charmDamageError: string | null = null;
  isLoadingCharm: boolean = false;

  // Loot Split Calculator
  lootSplitForm = {
    session: ''
  };
  lootSplitResult: any = null;
  lootSplitError: string | null = null;
  isLoadingLootSplit: boolean = false;



  get sortedTransfers() {
    if (!this.lootSplitResult?.transactions) return [];
    return [...this.lootSplitResult.transactions].sort((a, b) => b.amount - a.amount);
  }

  get totalTransfers() {
    if (!this.lootSplitResult?.transactions) return 0;
    return this.lootSplitResult.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  get selectedWeaponName() {
    const weaponNames = {
      'auto': 'Auto',
      'regular': 'Regular',
      'durable': 'Durable', 
      'lasting': 'Lasting'
    };
    return weaponNames[this.exerciseWeaponForm.weaponType as keyof typeof weaponNames] || 'Auto';
  }

  get selectedWeaponCount() {
    if (!this.exerciseWeaponsResult) return 0;
    const weaponType = this.exerciseWeaponForm.weaponType;
    return this.exerciseWeaponsResult.weaponsRequired[weaponType as keyof typeof this.exerciseWeaponsResult.weaponsRequired] || 0;
  }

  constructor(
    private calculatorsService: CalculatorsService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.carregando = true;
    // Simular carregamento
    setTimeout(() => {
      this.carregando = false;
    }, 1000);
  }

  setCalculator(type: 'exercise-weapons' | 'stamina' | 'charm-damage' | 'loot-split' | null) {
    // Track calculator selection
    if (type) {
      this.analyticsService.trackCalculatorUsage(type, { action: 'select' });
    }
    this.activeCalculator = type;
  }

  submitExerciseWeapons() {
    // Track calculator usage
    this.analyticsService.trackCalculatorUsage('exercise-weapons', this.exerciseWeaponForm);
    
    this.isLoadingExercise = true;
    this.exerciseWeaponsResult = null;
    this.exerciseWeaponsError = null;

    // Converter skill para 'melee' se for físico, exceto fist para monk
    let skill = this.exerciseWeaponForm.skill;
    if (["axe", "club", "sword"].includes(skill)) {
      skill = "melee";
    }
    // Para monk com fist, manter como "fist"
    if (this.exerciseWeaponForm.vocation === "monk" && skill === "fist") {
      skill = "fist";
    } else if (skill === "fist") {
      skill = "melee";
    }

    // Montar o payload conforme especificação
    const payload = {
      vocation: this.exerciseWeaponForm.vocation,
      skill: skill,
      currentSkill: this.exerciseWeaponForm.currentSkill,
      targetSkill: this.exerciseWeaponForm.targetSkill,
      percentageLeft: this.exerciseWeaponForm.percentageLeft,
      loyaltyBonus: this.exerciseWeaponForm.loyaltyBonus,
      hasDummy: this.exerciseWeaponForm.hasDummy,
      isDouble: this.exerciseWeaponForm.isDouble,
      weaponType: this.exerciseWeaponForm.weaponType
    };

    this.calculatorsService.exerciseWeapons(payload).subscribe({
      next: (res) => {
        this.exerciseWeaponsResult = res;
        this.isLoadingExercise = false;
      },
      error: (err) => {
        this.exerciseWeaponsError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingExercise = false;
      }
    });
  }

  resetExerciseWeapons() {
    this.exerciseWeaponForm = {
      vocation: 'knight',
      skill: 'melee',
      currentSkill: 100,
      targetSkill: 110,
      percentageLeft: 50,
      loyaltyBonus: 0,
      hasDummy: false,
      isDouble: false,
      weaponType: 'auto',
    };
    this.exerciseWeaponsResult = null;
    this.exerciseWeaponsError = null;
  }

  submitStamina() {
    // Track calculator usage
    this.analyticsService.trackCalculatorUsage('stamina', {
      currentStamina: this.staminaCurrent.seconds,
      targetStamina: this.staminaTarget.seconds
    });
    
    this.staminaError = null;
    this.staminaResult = null;
    // Validar e converter
    const currentSeconds = this.staminaCurrent.seconds;
    const targetSeconds = this.staminaTarget.seconds;
    if (
      isNaN(currentSeconds) ||
      isNaN(targetSeconds) ||
      currentSeconds < 0 ||
      targetSeconds < 0 ||
      targetSeconds > 42 * 60 * 60 ||
      currentSeconds > 42 * 60 * 60 ||
      targetSeconds < currentSeconds
    ) {
      this.staminaError = 'Preencha os campos corretamente.';
      return;
    }
    this.isLoadingStamina = true;
    this.calculatorsService.stamina({
      currentStamina: currentSeconds,
      targetStamina: targetSeconds
    }).subscribe({
      next: (res) => {
        this.staminaResult = res;
        this.isLoadingStamina = false;
      },
      error: (err) => {
        this.staminaError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingStamina = false;
      }
    });
  }

  resetStamina() {
    this.staminaForm = {
      currentStaminaStr: '',
      targetStaminaStr: ''
    };
    this.staminaErrorCurrent = false;
    this.staminaErrorTarget = false;
    this.staminaResult = null;
    this.staminaError = null;
  }

  submitCharmDamage() {
    // Track calculator usage
    this.analyticsService.trackCalculatorUsage('charm-damage', this.charmDamageForm);
    
    this.isLoadingCharm = true;
    this.charmDamageResult = null;
    this.charmDamageError = null;
    this.calculatorsService.charmDamage(this.charmDamageForm).subscribe({
      next: (res) => {
        this.charmDamageResult = res;
        this.isLoadingCharm = false;
      },
      error: (err) => {
        this.charmDamageError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingCharm = false;
      }
    });
  }

  resetCharmDamage() {
    this.charmDamageForm = {
      averageDamage: 0,
      creatureHp: 0,
      bonusResistance: 0,
      powerful: false
    };
    this.charmDamageResult = null;
    this.charmDamageError = null;
  }

  submitLootSplit() {
    // Track calculator usage
    this.analyticsService.trackCalculatorUsage('loot-split', { session: this.lootSplitForm.session });
    
    this.isLoadingLootSplit = true;
    this.lootSplitResult = null;
    this.lootSplitError = null;
    // Montar o payload apenas com a sessão
    const payload = {
      session: this.lootSplitForm.session
    };
    this.calculatorsService.lootSplit(payload).subscribe({
      next: (res) => {
        this.lootSplitResult = res;
        this.isLoadingLootSplit = false;
      },
      error: (err) => {
        this.lootSplitError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingLootSplit = false;
      }
    });
  }

  resetLootSplit() {
    this.lootSplitForm = {
      session: ''
    };
    this.lootSplitResult = null;
    this.lootSplitError = null;
  }

  // --- Funções de copiar para loot split ---
  copiedTransferIndex: number | null = null;
  copiedProfit: boolean = false;
  copiedAll: boolean = false;
  copiedSession: boolean = false;

  copyLootSession() {
    if (!this.lootSplitResult) return;
    const session = this.lootSplitResult.sessionDate || '';
    navigator.clipboard.writeText(session);
    this.copiedSession = true;
    setTimeout(() => (this.copiedSession = false), 1200);
  }

  copyTransfer(t: any) {
    // Novo formato: transfer {amount} to {to}
    const text = `transfer ${t.amount} to ${t.to}`;
    navigator.clipboard.writeText(text);
    const idx = this.lootSplitResult.transactions.indexOf(t);
    this.copiedTransferIndex = idx;
    setTimeout(() => (this.copiedTransferIndex = null), 1200);
  }

  copyProfit() {
    if (!this.lootSplitResult) return;
    const text = `${this.lootSplitResult.profitTotal} cada`;
    navigator.clipboard.writeText(text);
    this.copiedProfit = true;
    setTimeout(() => (this.copiedProfit = false), 1200);
  }

  copyAllLootResult() {
    if (!this.lootSplitResult) return;
    let text = '';
    text += `Sessão do time: ${this.lootSplitResult.sessionDate || ''}\n`;
    text += `Loot: ${this.lootSplitResult.teamReceipt.loot}\n`;
    text += `Supplies: ${this.lootSplitResult.teamReceipt.supplies}\n`;
    text += `Balance: ${this.lootSplitResult.teamReceipt.balance}\n`;
    if (this.lootSplitResult.transactions && this.lootSplitResult.transactions.length > 0) {
      text += `Transferências:\n`;
      for (const t of this.lootSplitResult.transactions) {
        text += `  ${t.from} → ${t.to}: ${t.amount}\n`;
      }
    }
    text += `Jogadores considerados: ${this.lootSplitResult.players.join(', ')}\n`;
    navigator.clipboard.writeText(text);
    this.copiedAll = true;
    setTimeout(() => (this.copiedAll = false), 1200);
  }

  // Máscara só ao sair do campo (blur)
  onStaminaInput(type: 'current' | 'target', event: any) {
    let value = event.target.value.replace(/[^0-9]/g, ''); // só números
    if (value.length > 4) value = value.slice(0, 4);
    // Não aplica máscara durante digitação
    if (type === 'current') this.staminaForm.currentStaminaStr = value;
    else this.staminaForm.targetStaminaStr = value;
    // Validação ao digitar
    this.formatStaminaInput(type);
  }

  onStaminaTimeChange(type: 'current' | 'target', value: string) {
    const [h, m] = value.split(':');
    const hours = Math.max(0, Math.min(42, Number(h) || 0));
    let minutes = Math.max(0, Math.min(59, Number(m) || 0));
    if (hours === 42) minutes = 0;
    if (type === 'current') {
      this.staminaCurrentRaw = value;
      this.staminaCurrent = toTimeValue(hours + ':' + minutes);
    } else {
      this.staminaTargetRaw = value;
      this.staminaTarget = toTimeValue(hours + ':' + minutes);
    }
    this.validateStaminaTimes();
  }

  validateStaminaTimes() {
    this.staminaInvalid =
      this.staminaCurrent.seconds > this.staminaTarget.seconds ||
      isNaN(this.staminaCurrent.seconds + this.staminaTarget.seconds);
  }

  // Limita a dois dígitos numéricos e impede valores inválidos
  onTimeInput(event: any, type: 'current' | 'target', field: 'hours' | 'minutes') {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    let num = Number(value);
    if (field === 'hours') {
      if (num > 42) num = 42;
    } else {
      if (num > 59) num = 59;
    }
    if (type === 'current') {
      if (field === 'hours') this.staminaCurrent.hours = isNaN(num) ? 0 : num;
      else this.staminaCurrent.minutes = isNaN(num) ? 0 : num;
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      if (field === 'hours') this.staminaTarget.hours = isNaN(num) ? 0 : num;
      else this.staminaTarget.minutes = isNaN(num) ? 0 : num;
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }

  // Métodos auxiliares para incrementar/decrementar
  incHour(type: 'current' | 'target') {
    if (type === 'current') {
      this.staminaCurrent.hours = Math.min(42, this.staminaCurrent.hours + 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.hours = Math.min(42, this.staminaTarget.hours + 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  decHour(type: 'current' | 'target') {
    if (type === 'current') {
      this.staminaCurrent.hours = Math.max(0, this.staminaCurrent.hours - 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.hours = Math.max(0, this.staminaTarget.hours - 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  incMin(type: 'current' | 'target') {
    if (type === 'current') {
      this.staminaCurrent.minutes = Math.min(59, this.staminaCurrent.minutes + 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.minutes = Math.min(59, this.staminaTarget.minutes + 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  decMin(type: 'current' | 'target') {
    if (type === 'current') {
      this.staminaCurrent.minutes = Math.max(0, this.staminaCurrent.minutes - 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.minutes = Math.max(0, this.staminaTarget.minutes - 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
} 