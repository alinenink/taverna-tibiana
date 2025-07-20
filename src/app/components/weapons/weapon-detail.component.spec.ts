import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { WeaponDetailComponent } from './weapon-detail.component';
import { WeaponsService } from '../../services/weapons.service';

// Importar tipos do Jasmine para resolver erros de linter
declare var describe: any;
declare var beforeEach: any;
declare var it: any;
declare var expect: any;
declare var jasmine: any;

describe('WeaponDetailComponent', () => {
  let component: WeaponDetailComponent;
  let fixture: ComponentFixture<WeaponDetailComponent>;
  let weaponsService: jasmine.SpyObj<WeaponsService>;

  const mockWeaponDetail = {
    success: true,
    weapon: {
      name: 'Amber Sabre',
      proficiency: {
        levels: [
          {
            level: 1,
            perks: [
              {
                icons: ['32_11345f84'],
                description: 'Aumenta o dano',
                title: 'Dano +1%'
              }
            ]
          }
        ]
      }
    },
    category: {
      id: 'swords',
      name: 'Espadas'
    }
  };

  beforeEach(async () => {
    const weaponsServiceSpy = jasmine.createSpyObj('WeaponsService', [
      'getWeaponDetails'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        WeaponDetailComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: WeaponsService, useValue: weaponsServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ category: 'swords', name: 'Amber%20Sabre' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeaponDetailComponent);
    component = fixture.componentInstance;
    weaponsService = TestBed.inject(WeaponsService) as jasmine.SpyObj<WeaponsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.loading()).toBe(true);
    expect(component.weapon()).toBe(null);
    expect(component.error()).toBe(null);
  });

  it('should load weapon details on init', () => {
    weaponsService.getWeaponDetails.and.returnValue(of(mockWeaponDetail));

    component.ngOnInit();

    expect(weaponsService.getWeaponDetails).toHaveBeenCalledWith('swords', 'Amber Sabre');
  });

  it('should set weapon data when API call succeeds', () => {
    weaponsService.getWeaponDetails.and.returnValue(of(mockWeaponDetail));

    component.loadWeaponDetail('swords', 'Amber Sabre');

    expect(component.loading()).toBe(false);
    expect(component.weapon()).toBeTruthy();
    expect(component.weapon()?.name).toBe('Amber Sabre');
    expect(component.error()).toBe(null);
  });

  it('should set error when API call fails', () => {
    const errorResponse = { success: false, message: 'Weapon not found' };
    weaponsService.getWeaponDetails.and.returnValue(of(errorResponse));

    component.loadWeaponDetail('swords', 'Invalid Weapon');

    expect(component.loading()).toBe(false);
    expect(component.weapon()).toBe(null);
    expect(component.error()).toBe('Weapon not found');
  });

  it('should handle HTTP errors', () => {
    weaponsService.getWeaponDetails.and.returnValue(throwError(() => new Error('HTTP Error')));

    component.loadWeaponDetail('swords', 'Amber Sabre');

    expect(component.loading()).toBe(false);
    expect(component.weapon()).toBe(null);
    expect(component.error()).toBe('Erro ao carregar detalhes da arma. Tente novamente.');
  });

  it('should return correct proficiencies status', () => {
    // Sem weapon
    expect(component.hasProficiencies).toBe(false);

    // Com weapon mas sem levels
    component.weapon.set({
      name: 'Test Weapon',
      category: 'swords',
      levels: []
    });
    expect(component.hasProficiencies).toBe(false);

    // Com weapon e levels
    component.weapon.set({
      name: 'Test Weapon',
      category: 'swords',
      levels: [{ level: 1, perks: [] }]
    });
    expect(component.hasProficiencies).toBe(true);
  });

  it('should convert proficiency levels correctly', () => {
    const apiLevels = [
      {
        level: 1,
        perks: [
          {
            icons: ['icon1'],
            description: 'Test perk',
            title: 'Test title'
          }
        ]
      }
    ];

    const result = component.convertProficiencyLevels(apiLevels);

    expect(result).toHaveSize(1);
    expect(result[0].level).toBe(1);
    expect(result[0].perks).toHaveSize(1);
    expect(result[0].perks[0].title).toBe('Test title');
  });

  it('should handle icon loading errors', () => {
    const mockEvent = {
      target: {
        style: { display: '' }
      }
    };

    // Teste básico sem spy
    component.onIconError(mockEvent);
    expect(mockEvent.target.style.display).toBe('none');
  });
}); 