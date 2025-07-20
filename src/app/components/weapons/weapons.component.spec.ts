import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { WeaponsComponent } from './weapons.component';
import { WeaponsService } from '../../services/weapons.service';
import { of, throwError } from 'rxjs';

// Importar tipos do Jasmine para resolver erros de linter
declare var describe: any;
declare var beforeEach: any;
declare var it: any;
declare var expect: any;
declare var jasmine: any;

describe('WeaponsComponent', () => {
  let component: WeaponsComponent;
  let fixture: ComponentFixture<WeaponsComponent>;
  let weaponsService: jasmine.SpyObj<WeaponsService>;

  const mockCategories = [
    {
      id: 'swords',
      name: 'Espadas',
      weapons_endpoint: '/api/weapons?action=list&category=swords',
      proficiencies_endpoint: '/api/weapons?action=proficiencies&category=swords'
    },
    {
      id: 'machados',
      name: 'Machados',
      weapons_endpoint: '/api/weapons?action=list&category=machados',
      proficiencies_endpoint: '/api/weapons?action=proficiencies&category=machados'
    }
  ];

  const mockWeapons = [
    {
      name: 'Amber Sabre',
      atk: 330,
      def: 0,
      level: 0,
      vocation: 'Todas',
      hands: 'Uma',
      tier: 1,
      endpoint: '/api/weapons?action=weapon&category=swords&name=Amber%20Sabre'
    },
    {
      name: 'Blade of Destruction',
      atk: 200,
      def: 0,
      level: 0,
      vocation: 'Todas',
      hands: 'Uma',
      tier: 1,
      endpoint: '/api/weapons?action=weapon&category=swords&name=Blade%20of%20Destruction'
    }
  ];

  const mockWeaponDetails = {
    name: 'Amber Sabre',
    wiki_url: 'https://www.tibiawiki.com.br/wiki/Amber_Sabre',
    level: 0,
    atk: 330,
    def: 0,
    weight: 0,
    slots: 0,
    vocation: 'Todas',
    hands: 'Uma',
    elemental_damage: {
      fire: 0,
      ice: 0,
      energy: 0,
      earth: 0,
      death: 0,
      holy: 0
    },
    def_mod: 0,
    bonus: null,
    tier: 1,
    dropped_by: '',
    scraped_at: '2025-07-14T15:45:09.596Z'
  };

  const mockStats = {
    total: 2,
    byVocation: { 'Todas': 2 },
    byTier: { 1: 2 },
    avgAtk: 265,
    avgDef: 0
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WeaponsService', [
      'getCategories',
      'getWeaponsByCategory',
      'getWeaponDetails',
      'getCategoryStats',
      'getCategoryDisplayName',
      'hasElementalDamage',
      'getPrimaryElementalType'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        WeaponsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: WeaponsService, useValue: spy }
      ]
    }).compileComponents();

    weaponsService = TestBed.inject(WeaponsService) as jasmine.SpyObj<WeaponsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    expect(weaponsService.getCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(mockCategories);
    expect(component.loading()).toBeFalse();
  });

  it('should handle error when loading categories', () => {
    const errorMessage = 'Erro ao carregar categorias';
    weaponsService.getCategories.and.returnValue(throwError(() => new Error(errorMessage)));

    fixture.detectChanges();

    expect(component.error()).toBe(errorMessage);
    expect(component.loading()).toBeFalse();
  });

  it('should change category and reload weapons', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'machados', name: 'Machados' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Machados');

    fixture.detectChanges();

    component.onCategoryChange('machados');

    expect(component.currentCategory()).toBe('machados');
    expect(weaponsService.getWeaponsByCategory).toHaveBeenCalledWith('machados');
  });

  it('should filter weapons by search term', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.searchTerm = 'Amber';
    component.onSearch();

    expect(component.weapons().length).toBe(1);
    expect(component.weapons()[0].name).toBe('Amber Sabre');
  });

  it('should filter weapons by vocation', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.selectedVocation = 'Knight';
    component.onVocationChange();

    expect(component.weapons().length).toBe(2); // Both weapons have 'Todas' vocation
  });

  it('should filter weapons by tier', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.selectedTier = '1';
    component.onTierChange();

    expect(component.weapons().length).toBe(2);
  });

  it('should filter weapons by minimum level', () => {
    const weaponsWithLevel = [
      { ...mockWeapons[0], level: 0 },
      { ...mockWeapons[1], level: 100 }
    ];

    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: weaponsWithLevel,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.minLevel = 100;
    component.onLevelChange();

    expect(component.weapons().length).toBe(1);
    expect(component.weapons()[0].name).toBe('Blade of Destruction');
  });

  it('should show weapon details', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getWeaponDetails.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      weapon: mockWeaponDetails
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.showWeaponDetails('Amber Sabre');

    expect(weaponsService.getWeaponDetails).toHaveBeenCalledWith('swords', 'Amber Sabre');
    expect(component.selectedWeapon()).toEqual(mockWeaponDetails);
  });

  it('should close modal', () => {
    component.selectedWeapon.set(mockWeaponDetails);

    component.closeModal();

    expect(component.selectedWeapon()).toBeNull();
  });

  it('should get category icon', () => {
    expect(component.getCategoryIcon('swords')).toBe('assets/icons-svg/swords.svg');
    expect(component.getCategoryIcon('axes')).toBe('assets/icons-svg/axes.svg');
    expect(component.getCategoryIcon('unknown')).toBe('assets/icons-svg/swords.svg');
  });

  it('should check if weapon has elemental damage', () => {
    weaponsService.hasElementalDamage.and.returnValue(true);

    const weaponWithElemental = { 
      ...mockWeaponDetails, 
      elemental_damage: { 
        fire: 25, 
        ice: 0, 
        energy: 0, 
        earth: 0, 
        death: 0, 
        holy: 0 
      } 
    };
    component.selectedWeapon.set(weaponWithElemental);

    const result = component.hasElementalDamage();

    expect(result).toBeTrue();
    expect(weaponsService.hasElementalDamage).toHaveBeenCalledWith(weaponWithElemental);
  });

  it('should get elemental types', () => {
    const weaponWithElemental = {
      ...mockWeaponDetails,
      elemental_damage: {
        fire: 25,
        ice: 0,
        energy: 10,
        earth: 0,
        death: 0,
        holy: 0
      }
    };
    component.selectedWeapon.set(weaponWithElemental);

    const result = component.getElementalTypes();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ name: 'Fire', value: 25 });
    expect(result[1]).toEqual({ name: 'Energy', value: 10 });
  });

  it('should get bonus items', () => {
    const weaponWithBonus = {
      ...mockWeaponDetails,
      bonus: {
        critical_hit_chance: 5,
        critical_hit_damage: 10
      }
    };
    component.selectedWeapon.set(weaponWithBonus);

    const result = component.getBonusItems();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ name: 'Critical Hit Chance', value: 5 });
    expect(result[1]).toEqual({ name: 'Critical Hit Damage', value: 10 });
  });

  it('should reset filters when changing category', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    // Set some filters
    component.searchTerm = 'test';
    component.selectedVocation = 'Knight';
    component.selectedTier = '2';
    component.minLevel = 50;

    // Change category
    component.onCategoryChange('machados');

    // Check if filters were reset
    expect(component.searchTerm).toBe('');
    expect(component.selectedVocation).toBe('');
    expect(component.selectedTier).toBe('');
    expect(component.minLevel).toBe(0);
  });



  it('should handle empty search term', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.searchTerm = '';
    component.onSearch();

    expect(component.weapons().length).toBe(2);
  });

  it('should handle case insensitive search', () => {
    weaponsService.getCategories.and.returnValue(of(mockCategories));
    weaponsService.getWeaponsByCategory.and.returnValue(of({
      category: { id: 'swords', name: 'Espadas' },
      data: mockWeapons,
      total: 2
    }));
    weaponsService.getCategoryStats.and.returnValue(of(mockStats));
    weaponsService.getCategoryDisplayName.and.returnValue('Espadas');

    fixture.detectChanges();

    component.searchTerm = 'amber';
    component.onSearch();

    expect(component.weapons().length).toBe(1);
    expect(component.weapons()[0].name).toBe('Amber Sabre');
  });
}); 