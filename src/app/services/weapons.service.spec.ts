import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeaponsService, WeaponCategoryType } from './weapons.service';
import { environment } from '../environments/environments';

// Importar tipos do Jasmine para resolver erros de linter
declare var describe: any;
declare var beforeEach: any;
declare var afterEach: any;
declare var it: any;
declare var expect: any;
declare var fail: any;
declare var spyOn: any;

describe('WeaponsService', () => {
  let service: WeaponsService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/weapons';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeaponsService]
    });
    service = TestBed.inject(WeaponsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategories', () => {
    it('should return categories successfully', () => {
      const mockCategories = [
        {
          id: 'swords',
          name: 'Espadas',
          weapons_endpoint: '/api/weapons?action=list&category=swords',
          proficiencies_endpoint: '/api/weapons?action=proficiencies&category=swords'
        }
      ];

      const mockResponse = {
        success: true,
        data: mockCategories,
        total: 1
      };

      service.getCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      const mockError = {
        success: false,
        message: 'Erro interno do servidor'
      };

      service.getCategories().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro interno do servidor');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getWeaponsByCategory', () => {
    it('should return weapons for a category successfully', () => {
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
        }
      ];

      const mockResponse = {
        success: true,
        data: {
          category: { id: 'swords', name: 'Espadas' },
          data: mockWeapons,
          total: 1
        }
      };

      service.getWeaponsByCategory('swords').subscribe(response => {
        expect(response.data).toEqual(mockWeapons);
        expect(response.category.id).toBe('swords');
        expect(response.total).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}?action=list&category=swords`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle invalid category error', () => {
      const mockError = {
        success: false,
        message: 'Categoria inválida',
        available_categories: ['swords', 'machados', 'clavas']
      };

      service.getWeaponsByCategory('invalid' as WeaponCategoryType).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Categoria inválida');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=list&category=invalid`);
      req.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getWeaponDetails', () => {
    it('should return weapon details successfully', () => {
      const mockWeapon = {
        name: 'Amber Sabre',
        wiki_url: 'https://www.tibiawiki.com.br/wiki/Amber_Sabre',
        level: 0,
        atk: 330,
        def: 0,
        weight: 0,
        slots: 0,
        vocation: 'Todas',
        hands: 'Uma',
        elemental_damage: null,
        def_mod: 0,
        bonus: null,
        tier: 1,
        dropped_by: '',
        scraped_at: '2025-07-14T15:45:09.596Z'
      };

      const mockResponse = {
        success: true,
        data: {
          category: { id: 'swords', name: 'Espadas' },
          weapon: mockWeapon
        }
      };

      service.getWeaponDetails('swords', 'Amber Sabre').subscribe(response => {
        expect(response.weapon).toEqual(mockWeapon);
        expect(response.category.id).toBe('swords');
      });

      const req = httpMock.expectOne(`${baseUrl}?action=weapon&category=swords&name=Amber%20Sabre`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProficienciesByCategory', () => {
    it('should return proficiencies for a category successfully', () => {
      const mockProficiencies = [
        {
          original_data: {
            name: 'Amber Sabre',
            atk: 330,
            def: 0,
            level: 0,
            vocation: 'Todas',
            hands: 'Uma',
            tier: 1,
            weight: 0,
            slots: 0,
            wiki_url: 'https://www.tibiawiki.com.br/wiki/Amber_Sabre',
            elemental_damage: null,
            def_mod: 0,
            bonus: null,
            dropped_by: '',
            scraped_at: '2025-07-14T15:45:09.596Z'
          },
          proficiency_data: [],
          scraping_status: 'completed'
        }
      ];

      const mockResponse = {
        success: true,
        data: {
          category: { id: 'swords', name: 'Espadas' },
          data: mockProficiencies,
          total: 1
        }
      };

      service.getProficienciesByCategory('swords').subscribe(response => {
        expect(response.data).toEqual(mockProficiencies);
        expect(response.category.id).toBe('swords');
        expect(response.total).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}?action=proficiencies&category=swords`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProficiencyDetails', () => {
    it('should return proficiency details successfully', () => {
      const mockProficiency = {
        original_data: {
          name: 'Amber Sabre',
          atk: 330,
          def: 0,
          level: 0,
          vocation: 'Todas',
          hands: 'Uma',
          tier: 1,
          weight: 0,
          slots: 0,
          wiki_url: 'https://www.tibiawiki.com.br/wiki/Amber_Sabre',
          elemental_damage: null,
          def_mod: 0,
          bonus: null,
          dropped_by: '',
          scraped_at: '2025-07-14T15:45:09.596Z'
        },
        proficiency_data: [],
        scraping_status: 'completed'
      };

      const mockResponse = {
        success: true,
        data: {
          category: { id: 'swords', name: 'Espadas' },
          proficiency: mockProficiency
        }
      };

      service.getProficiencyDetails('swords', 'Amber Sabre').subscribe(response => {
        expect(response.proficiency).toEqual(mockProficiency);
        expect(response.category.id).toBe('swords');
      });

      const req = httpMock.expectOne(`${baseUrl}?action=proficiency&category=swords&name=Amber%20Sabre`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('searchWeapons', () => {
    it('should filter weapons by search term', () => {
      const mockWeapons = [
        { name: 'Amber Sabre', atk: 330, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' },
        { name: 'Blade of Destruction', atk: 200, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' }
      ];

      spyOn(service, 'getWeaponsByCategory').and.returnValue({
        subscribe: (observer: any) => {
          observer.next({
            category: { id: 'swords', name: 'Espadas' },
            data: mockWeapons,
            total: 2
          });
        }
      } as any);

      service.searchWeapons('swords', 'sabre').subscribe(response => {
        expect(response.data.length).toBe(1);
        expect(response.data[0].name).toBe('Amber Sabre');
      });
    });

    it('should return all weapons when search term is empty', () => {
      const mockWeapons = [
        { name: 'Amber Sabre', atk: 330, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' }
      ];

      spyOn(service, 'getWeaponsByCategory').and.returnValue({
        subscribe: (observer: any) => {
          observer.next({
            category: { id: 'swords', name: 'Espadas' },
            data: mockWeapons,
            total: 1
          });
        }
      } as any);

      service.searchWeapons('swords', '').subscribe(response => {
        expect(response.data.length).toBe(1);
        expect(response.data).toEqual(mockWeapons);
      });
    });
  });

  describe('getWeaponsByLevel', () => {
    it('should filter weapons by minimum level', () => {
      const mockWeapons = [
        { name: 'Amber Sabre', atk: 330, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' },
        { name: 'Blade of Destruction', atk: 200, def: 0, level: 100, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' }
      ];

      spyOn(service, 'getWeaponsByCategory').and.returnValue({
        subscribe: (observer: any) => {
          observer.next({
            category: { id: 'swords', name: 'Espadas' },
            data: mockWeapons,
            total: 2
          });
        }
      } as any);

      service.getWeaponsByLevel('swords', 100).subscribe(response => {
        expect(response.data.length).toBe(1);
        expect(response.data[0].name).toBe('Blade of Destruction');
      });
    });
  });

  describe('getWeaponsByVocation', () => {
    it('should filter weapons by vocation', () => {
      const mockWeapons = [
        { name: 'Amber Sabre', atk: 330, def: 0, level: 0, vocation: 'Knight', hands: 'Uma', tier: 1, endpoint: '' },
        { name: 'Blade of Destruction', atk: 200, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' }
      ];

      spyOn(service, 'getWeaponsByCategory').and.returnValue({
        subscribe: (observer: any) => {
          observer.next({
            category: { id: 'swords', name: 'Espadas' },
            data: mockWeapons,
            total: 2
          });
        }
      } as any);

      service.getWeaponsByVocation('swords', 'Knight').subscribe(response => {
        expect(response.data.length).toBe(2); // Both should match (Knight and Todas)
      });
    });
  });

  describe('getWeaponsByTier', () => {
    it('should filter weapons by tier', () => {
      const mockWeapons = [
        { name: 'Amber Sabre', atk: 330, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 1, endpoint: '' },
        { name: 'Blade of Destruction', atk: 200, def: 0, level: 0, vocation: 'Todas', hands: 'Uma', tier: 2, endpoint: '' }
      ];

      spyOn(service, 'getWeaponsByCategory').and.returnValue({
        subscribe: (observer: any) => {
          observer.next({
            category: { id: 'swords', name: 'Espadas' },
            data: mockWeapons,
            total: 2
          });
        }
      } as any);

      service.getWeaponsByTier('swords', 1).subscribe(response => {
        expect(response.data.length).toBe(1);
        expect(response.data[0].name).toBe('Amber Sabre');
      });
    });
  });

  describe('getCategoryStats', () => {
    it('should calculate category statistics correctly', () => {
      const mockWeapons = [
        { name: 'Amber Sabre', atk: 100, def: 10, level: 0, vocation: 'Knight', hands: 'Uma', tier: 1, endpoint: '' },
        { name: 'Blade of Destruction', atk: 200, def: 20, level: 0, vocation: 'Knight', hands: 'Uma', tier: 2, endpoint: '' }
      ];

      spyOn(service, 'getWeaponsByCategory').and.returnValue({
        subscribe: (observer: any) => {
          observer.next({
            category: { id: 'swords', name: 'Espadas' },
            data: mockWeapons,
            total: 2
          });
        }
      } as any);

      service.getCategoryStats('swords').subscribe(stats => {
        expect(stats.total).toBe(2);
        expect(stats.avgAtk).toBe(150);
        expect(stats.avgDef).toBe(15);
        expect(stats.byVocation['Knight']).toBe(2);
        expect(stats.byTier[1]).toBe(1);
        expect(stats.byTier[2]).toBe(1);
      });
    });
  });

  describe('hasElementalDamage', () => {
    it('should return true for weapon with elemental damage', () => {
      const weapon = {
        name: 'Blade of Destruction',
        atk: 200,
        def: 0,
        level: 0,
        vocation: 'Todas',
        hands: 'Uma',
        tier: 1,
        weight: 0,
        slots: 50,
        wiki_url: 'https://www.tibiawiki.com.br/wiki/Blade_of_Destruction',
        elemental_damage: {
          fire: 25,
          ice: 0,
          energy: 0,
          earth: 0,
          death: 0,
          holy: 0
        },
        def_mod: 0,
        bonus: null,
        dropped_by: '',
        scraped_at: '2025-07-14T15:45:48.733Z'
      };

      expect(service.hasElementalDamage(weapon)).toBe(true);
    });

    it('should return false for weapon without elemental damage', () => {
      const weapon = {
        name: 'Amber Sabre',
        atk: 330,
        def: 0,
        level: 0,
        vocation: 'Todas',
        hands: 'Uma',
        tier: 1,
        weight: 0,
        slots: 0,
        wiki_url: 'https://www.tibiawiki.com.br/wiki/Amber_Sabre',
        elemental_damage: null,
        def_mod: 0,
        bonus: null,
        dropped_by: '',
        scraped_at: '2025-07-14T15:45:09.596Z'
      };

      expect(service.hasElementalDamage(weapon)).toBe(false);
    });
  });

  describe('getPrimaryElementalType', () => {
    it('should return primary elemental type', () => {
      const weapon = {
        name: 'Blade of Destruction',
        atk: 200,
        def: 0,
        level: 0,
        vocation: 'Todas',
        hands: 'Uma',
        tier: 1,
        weight: 0,
        slots: 50,
        wiki_url: 'https://www.tibiawiki.com.br/wiki/Blade_of_Destruction',
        elemental_damage: {
          fire: 25,
          ice: 10,
          energy: 0,
          earth: 0,
          death: 0,
          holy: 0
        },
        def_mod: 0,
        bonus: null,
        dropped_by: '',
        scraped_at: '2025-07-14T15:45:48.733Z'
      };

      expect(service.getPrimaryElementalType(weapon)).toBe('fire');
    });

    it('should return null for weapon without elemental damage', () => {
      const weapon = {
        name: 'Amber Sabre',
        atk: 330,
        def: 0,
        level: 0,
        vocation: 'Todas',
        hands: 'Uma',
        tier: 1,
        weight: 0,
        slots: 0,
        wiki_url: 'https://www.tibiawiki.com.br/wiki/Amber_Sabre',
        elemental_damage: null,
        def_mod: 0,
        bonus: null,
        dropped_by: '',
        scraped_at: '2025-07-14T15:45:09.596Z'
      };

      expect(service.getPrimaryElementalType(weapon)).toBeNull();
    });
  });

  describe('getCategoryDisplayName', () => {
    it('should return correct display names for all categories', () => {
      expect(service.getCategoryDisplayName('swords')).toBe('Espadas');
      expect(service.getCategoryDisplayName('machados')).toBe('Machados');
      expect(service.getCategoryDisplayName('clavas')).toBe('Clavas');
      expect(service.getCategoryDisplayName('ranged_weapons')).toBe('Armas de Longo Alcance');
      expect(service.getCategoryDisplayName('rods')).toBe('Varinhas');
      expect(service.getCategoryDisplayName('wands')).toBe('Cajados');
      expect(service.getCategoryDisplayName('fist_weapons')).toBe('Armas de Punho');
    });

    it('should return original category name for unknown category', () => {
      expect(service.getCategoryDisplayName('unknown' as WeaponCategoryType)).toBe('unknown');
    });
  });

  describe('error handling', () => {
    it('should handle HTTP 400 error', () => {
      service.getCategories().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Parâmetros inválidos');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP 404 error', () => {
      service.getCategories().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Recurso não encontrado');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP 405 error', () => {
      service.getCategories().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Método não permitido');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      req.flush({}, { status: 405, statusText: 'Method Not Allowed' });
    });

    it('should handle HTTP 500 error', () => {
      service.getCategories().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Erro interno do servidor');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      service.getCategories().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Ocorreu um erro inesperado');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?action=categories`);
      req.error(new ErrorEvent('Network error'));
    });
  });
}); 