import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BestiaryComponent } from './bestiary.component';
import {
  BestiaryService,
  Monster,
  MonsterClassType,
  MonsterDifficulty,
} from '../../services/bestiary.service';
import { environment } from '../../environments/environments';
import { of, throwError } from 'rxjs';

// Importar tipos do Jasmine para resolver erros de linter
declare var describe: any;
declare var beforeEach: any;
declare var afterEach: any;
declare var it: any;
declare var expect: any;
declare var fail: any;
declare var spyOn: any;
declare var jasmine: any;

describe('BestiaryComponent', () => {
  let component: BestiaryComponent;
  let fixture: ComponentFixture<BestiaryComponent>;
  let bestiaryService: any;

  const mockMonster: Monster = {
    id: 1,
    name: 'Rat',
    order: 1,
    hitpoints: 20,
    experience: 5,
    speed: 100,
    mitigation: 0,
    armor: 0,
    difficulty: 'trivial',
    occurrence: 'common',
    locations: ['Rookgaard', 'Thais'],
    image: '/monster-images/1_Rat.gif',
    class: {
      name: 'animal',
      description: 'Wild animals',
    },
    resistances: {
      physical: 0,
      fire: 0,
      ice: 0,
      energy: 0,
      death: 0,
      holy: 0,
    },
    charm: {
      name: 'Charm Rat',
      description: 'Charm a rat to fight for you',
    },
  };

  const mockResponse = {
    monsters: [mockMonster],
    pagination: {
      currentPage: 1,
      totalPages: 39,
      totalItems: 780,
      itemsPerPage: 20,
      hasNextPage: true,
      hasPreviousPage: false,
    },
    filters: {
      search: 'dragon',
      class: 'dragon',
      difficulty: 'hard',
    },
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BestiaryService', [
      'getMonsters',
      'searchMonsters',
      'getMonstersByClass',
      'getMonstersByDifficulty',
      'getAvailableClasses',
      'getAvailableDifficulties',
      'getClassDisplayName',
      'getDifficultyDisplayName',
      'getDifficultyColor',
      'hasSignificantResistances',
      'getHighestResistance',
    ]);

    await TestBed.configureTestingModule({
      imports: [BestiaryComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: BestiaryService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BestiaryComponent);
    component = fixture.componentInstance;
    bestiaryService = TestBed.inject(BestiaryService);

    // Configurar spies padrão
    bestiaryService.getMonsters.and.returnValue(of(mockResponse));
    bestiaryService.getAvailableClasses.and.returnValue(['animal', 'dragon', 'undead']);
    bestiaryService.getAvailableDifficulties.and.returnValue([
      'trivial',
      'easy',
      'medium',
      'hard',
      'extreme',
    ]);
    bestiaryService.getClassDisplayName.and.callFake((className: MonsterClassType) => {
      const names: Record<MonsterClassType, string> = {
        animal: 'Animal',
        dragon: 'Dragão',
        undead: 'Morto-vivo',
      } as Record<MonsterClassType, string>;
      return names[className] || className;
    });
    bestiaryService.getDifficultyDisplayName.and.callFake((difficulty: MonsterDifficulty) => {
      const names: Record<MonsterDifficulty, string> = {
        trivial: 'Trivial',
        easy: 'Fácil',
        medium: 'Médio',
        hard: 'Difícil',
        extreme: 'Extremo',
      };
      return names[difficulty] || difficulty;
    });
    bestiaryService.getDifficultyColor.and.returnValue('#4CAF50');
    bestiaryService.hasSignificantResistances.and.returnValue(false);
    bestiaryService.getHighestResistance.and.returnValue({ type: '', value: 0 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    component.ngOnInit();

    expect(component.monsters()).toEqual([]);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.pagination().currentPage).toBe(1);
  });

  it('should load monsters on init', () => {
    component.ngOnInit();

    expect(bestiaryService.getMonsters).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
  });

  it('should handle successful monster loading', () => {
    component.ngOnInit();

    expect(component.monsters()).toEqual(mockResponse.monsters);
    expect(component.pagination()).toEqual(mockResponse.pagination);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should handle error when loading monsters', () => {
    const errorMessage = 'Erro ao carregar monstros';
    bestiaryService.getMonsters.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(component.error()).toBe(errorMessage);
    expect(component.loading()).toBe(false);
    expect(component.monsters()).toEqual([]);
  });

  it('should clear filters', () => {
    component.ngOnInit();

    // Simular filtros aplicados
    component.filterForm.patchValue({
      search: 'dragon',
      class: 'dragon',
      difficulty: 'hard',
    });

    component.clearFilters();

    expect(component.filterForm.value).toEqual({
      search: '',
      class: '',
      difficulty: '',
    });
    expect(component.pagination().currentPage).toBe(1);
  });

  it('should handle page change', () => {
    component.ngOnInit();

    component.onPageChange(1, 50);

    expect(component.pagination().currentPage).toBe(2);
    expect(component.pagination().itemsPerPage).toBe(50);
  });

  it('should format numbers correctly', () => {
    expect(component.formatNumber(1000)).toBe('1.000');
    expect(component.formatNumber(1234567)).toBe('1.234.567');
  });

  it('should get monster image URL', () => {
    const relativePath = '/monster-images/1_Rat.gif';
    const absolutePath = 'https://example.com/image.gif';

    const expectedBackendUrl = environment.apiUrl.replace('/api', '') + '/monster-images/1_Rat.gif';
    expect(component.getMonsterImageUrl(relativePath)).toBe(expectedBackendUrl);
    expect(component.getMonsterImageUrl(absolutePath)).toBe(absolutePath);
  });

  it('should get resistance display names', () => {
    expect(component.getResistanceDisplayName('physical')).toBe('Físico');
    expect(component.getResistanceDisplayName('fire')).toBe('Fogo');
    expect(component.getResistanceDisplayName('ice')).toBe('Gelo');
    expect(component.getResistanceDisplayName('energy')).toBe('Energia');
    expect(component.getResistanceDisplayName('death')).toBe('Morte');
    expect(component.getResistanceDisplayName('holy')).toBe('Sagrado');
    expect(component.getResistanceDisplayName('unknown')).toBe('unknown');
  });

  it('should get resistances array', () => {
    const resistances = component.getResistancesArray(mockMonster);

    expect(resistances).toEqual([
      { type: 'Físico', value: 0 },
      { type: 'Fogo', value: 0 },
      { type: 'Gelo', value: 0 },
      { type: 'Energia', value: 0 },
      { type: 'Morte', value: 0 },
      { type: 'Sagrado', value: 0 },
    ]);
  });

  it('should track monsters by ID', () => {
    expect(component.trackByMonsterId(0, mockMonster)).toBe(mockMonster.id);
  });

  it('should handle image error', () => {
    const mockEvent = {
      target: {
        style: { display: '' },
        parentElement: {
          innerHTML: '',
        },
      },
    };

    component.onImageError(mockEvent, mockMonster);

    expect(mockEvent.target.style.display).toBe('none');
    expect(mockEvent.target.parentElement.innerHTML).toContain('🐉');
  });

  it('should handle image load', () => {
    const mockEvent = {
      target: {
        style: { opacity: '' },
      },
    };

    component.onImageLoad(mockEvent, mockMonster);

    expect(mockEvent.target.style.opacity).toBe('1');
  });

  it('should have computed properties working correctly', () => {
    component.ngOnInit();

    expect(component.hasMonsters()).toBe(false); // Inicialmente vazio

    // Simular monstros carregados
    component.monsters.set([mockMonster]);
    expect(component.hasMonsters()).toBe(true);

    // Simular erro
    component.error.set('Erro de teste');
    expect(component.hasError()).toBe(true);

    // Simular loading
    component.loading.set(true);
    expect(component.isLoading()).toBe(true);
  });

  it('should have Math reference for template', () => {
    expect(component.Math).toBe(Math);
  });
});
