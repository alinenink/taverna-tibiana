import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  BestiaryService,
  Monster,
  BestiaryResponse,
  MonsterClassType,
  MonsterDifficulty,
} from './bestiary.service';
import { environment } from '../environments/environments';

// Importar tipos do Jasmine para resolver erros de linter
declare var describe: any;
declare var beforeEach: any;
declare var afterEach: any;
declare var it: any;
declare var expect: any;
declare var fail: any;
declare var spyOn: any;

describe('BestiaryService', () => {
  let service: BestiaryService;
  let httpMock: HttpTestingController;

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

  const mockResponse: BestiaryResponse = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BestiaryService],
    });
    service = TestBed.inject(BestiaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMonsters', () => {
    it('should fetch monsters with default parameters', () => {
      service.getMonsters().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('\/bestiary');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch monsters with custom parameters', () => {
      const params = {
        page: 2,
        limit: 50,
        search: 'dragon',
        class: 'dragon' as MonsterClassType,
        difficulty: 'hard' as MonsterDifficulty,
      };

      service.getMonsters(params).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        '\/bestiary?page=2&limit=50&search=dragon&class=dragon&difficulty=hard'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should limit maximum items per page to 100', () => {
      service.getMonsters({ limit: 150 }).subscribe();

      const req = httpMock.expectOne('\/bestiary?limit=100');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('searchMonsters', () => {
    it('should search monsters by name', () => {
      service.searchMonsters('dragon').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('\/bestiary?search=dragon');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should search monsters with additional parameters', () => {
      service.searchMonsters('dragon', { page: 2, limit: 10 }).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('\/bestiary?page=2&limit=10&search=dragon');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getMonstersByClass', () => {
    it('should fetch monsters by class', () => {
      service.getMonstersByClass('dragon').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('\/bestiary?class=dragon');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getMonstersByDifficulty', () => {
    it('should fetch monsters by difficulty', () => {
      service.getMonstersByDifficulty('hard').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('\/bestiary?difficulty=hard');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getMonsterById', () => {
    it('should fetch a specific monster by ID', () => {
      service.getMonsterById(1).subscribe(monster => {
        expect(monster).toEqual(mockMonster);
      });

      const req = httpMock.expectOne('\/bestiary/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockMonster);
    });
  });

  describe('getMonsterStats', () => {
    it('should calculate monster statistics', () => {
      const mockStatsResponse: BestiaryResponse = {
        monsters: [
          {
            ...mockMonster,
            class: { name: 'animal', description: 'Wild animals' },
            difficulty: 'trivial',
          },
          {
            ...mockMonster,
            id: 2,
            name: 'Dragon',
            class: { name: 'dragon', description: 'Dragons' },
            difficulty: 'hard',
            hitpoints: 1000,
            experience: 500,
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 1000,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        filters: {},
      };

      service.getMonsterStats().subscribe(stats => {
        expect(stats.totalMonsters).toBe(2);
        expect(stats.byClass.animal).toBe(1);
        expect(stats.byClass.dragon).toBe(1);
        expect(stats.byDifficulty.trivial).toBe(1);
        expect(stats.byDifficulty.hard).toBe(1);
        expect(stats.avgHitpoints).toBe(510); // (20 + 1000) / 2
        expect(stats.avgExperience).toBe(252.5); // (5 + 500) / 2
      });

      const req = httpMock.expectOne('\/bestiary?limit=1000');
      req.flush(mockStatsResponse);
    });
  });

  describe('getAvailableClasses', () => {
    it('should return all available monster classes', () => {
      const classes = service.getAvailableClasses();
      expect(classes).toContain('animal');
      expect(classes).toContain('dragon');
      expect(classes).toContain('undead');
      expect(classes.length).toBe(20);
    });
  });

  describe('getAvailableDifficulties', () => {
    it('should return all available difficulties', () => {
      const difficulties = service.getAvailableDifficulties();
      expect(difficulties).toEqual(['trivial', 'easy', 'medium', 'hard', 'extreme']);
    });
  });

  describe('getClassDisplayName', () => {
    it('should return correct display names for classes', () => {
      expect(service.getClassDisplayName('animal')).toBe('Animal');
      expect(service.getClassDisplayName('dragon')).toBe('Dragão');
      expect(service.getClassDisplayName('undead')).toBe('Morto-vivo');
      expect(service.getClassDisplayName('demon')).toBe('Demônio');
    });

    it('should return original name for unknown class', () => {
      expect(service.getClassDisplayName('unknown' as MonsterClassType)).toBe('unknown');
    });
  });

  describe('getDifficultyDisplayName', () => {
    it('should return correct display names for difficulties', () => {
      expect(service.getDifficultyDisplayName('trivial')).toBe('Trivial');
      expect(service.getDifficultyDisplayName('easy')).toBe('Fácil');
      expect(service.getDifficultyDisplayName('medium')).toBe('Médio');
      expect(service.getDifficultyDisplayName('hard')).toBe('Difícil');
      expect(service.getDifficultyDisplayName('extreme')).toBe('Extremo');
    });

    it('should return original name for unknown difficulty', () => {
      expect(service.getDifficultyDisplayName('unknown' as MonsterDifficulty)).toBe('unknown');
    });
  });

  describe('getDifficultyColor', () => {
    it('should return correct colors for difficulties', () => {
      expect(service.getDifficultyColor('trivial')).toBe('#4CAF50');
      expect(service.getDifficultyColor('easy')).toBe('#8BC34A');
      expect(service.getDifficultyColor('medium')).toBe('#FFC107');
      expect(service.getDifficultyColor('hard')).toBe('#FF9800');
      expect(service.getDifficultyColor('extreme')).toBe('#F44336');
    });

    it('should return default color for unknown difficulty', () => {
      expect(service.getDifficultyColor('unknown' as MonsterDifficulty)).toBe('#757575');
    });
  });

  describe('hasSignificantResistances', () => {
    it('should return false for monster with no resistances', () => {
      const monsterWithNoResistances = { ...mockMonster };
      expect(service.hasSignificantResistances(monsterWithNoResistances)).toBe(false);
    });

    it('should return true for monster with resistances', () => {
      const monsterWithResistances = {
        ...mockMonster,
        resistances: {
          physical: 0,
          fire: 50,
          ice: 0,
          energy: 0,
          death: 0,
          holy: 0,
        },
      };
      expect(service.hasSignificantResistances(monsterWithResistances)).toBe(true);
    });
  });

  describe('getHighestResistance', () => {
    it('should return highest resistance', () => {
      const monsterWithResistances = {
        ...mockMonster,
        resistances: {
          physical: 10,
          fire: 50,
          ice: 25,
          energy: 0,
          death: 0,
          holy: 0,
        },
      };
      const highest = service.getHighestResistance(monsterWithResistances);
      expect(highest.type).toBe('fire');
      expect(highest.value).toBe(50);
    });

    it('should return empty resistance when all are zero', () => {
      const highest = service.getHighestResistance(mockMonster);
      expect(highest.type).toBe('');
      expect(highest.value).toBe(0);
    });
  });

  describe('getMonsterImageUrl', () => {
    it('should return local image path for available images', () => {
      const localImage = service.getMonsterImageUrl('/monster-images/532_Rotworm.gif');
      expect(localImage).toBe('/assets/monster-images/532_Rotworm.gif');
    });

    it('should return backend URL for unavailable images', () => {
      const backendImage = service.getMonsterImageUrl('/monster-images/999_NonExistent.gif');
      const expectedBackendUrl =
        environment.apiUrl.replace('/api', '') + '/monster-images/999_NonExistent.gif';
      expect(backendImage).toBe(expectedBackendUrl);
    });

    it('should return absolute URL as is', () => {
      const absoluteUrl = 'https://example.com/image.gif';
      const result = service.getMonsterImageUrl(absoluteUrl);
      expect(result).toBe(absoluteUrl);
    });

    it('should handle malformed paths', () => {
      const malformedPath = 'invalid-path';
      const result = service.getMonsterImageUrl(malformedPath);
      const expectedBackendUrl = environment.apiUrl.replace('/api', '') + '/invalid-path';
      expect(result).toBe(expectedBackendUrl);
    });
  });

  describe('getMonsterImageFileName', () => {
    it('should generate correct filename from monster data', () => {
      const filename = service.getMonsterImageFileName(1, 'Rat');
      expect(filename).toBe('1_Rat.gif');
    });

    it('should handle special characters in monster name', () => {
      const filename = service.getMonsterImageFileName(123, 'Dragon Lord');
      expect(filename).toBe('123_Dragon_Lord.gif');
    });

    it('should handle multiple special characters', () => {
      const filename = service.getMonsterImageFileName(456, 'Ancient Scarab');
      expect(filename).toBe('456_Ancient_Scarab.gif');
    });
  });

  describe('error handling', () => {
    it('should handle 400 error', () => {
      service.getMonsters().subscribe({
        error: error => {
          expect(error.message).toBe('Parâmetros inválidos na requisição');
        },
      });

      const req = httpMock.expectOne('\/bestiary');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 429 error', () => {
      service.getMonsters().subscribe({
        error: error => {
          expect(error.message).toBe(
            'Limite de requisições excedido. Tente novamente em alguns minutos'
          );
        },
      });

      const req = httpMock.expectOne('\/bestiary');
      req.flush('Too Many Requests', { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle 500 error', () => {
      service.getMonsters().subscribe({
        error: error => {
          expect(error.message).toBe('Erro interno do servidor');
        },
      });

      const req = httpMock.expectOne('\/bestiary');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      service.getMonsters().subscribe({
        error: error => {
          expect(error.message).toBe('Ocorreu um erro inesperado');
        },
      });

      const req = httpMock.expectOne('\/bestiary');
      req.error(new ErrorEvent('Network error'));
    });
  });
});
