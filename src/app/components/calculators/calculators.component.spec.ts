import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorsComponent } from './calculators.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('CalculatorsComponent', () => {
  let component: CalculatorsComponent;
  let fixture: ComponentFixture<CalculatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorsComponent, RouterTestingModule, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalculatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with exercise-weapons calculator active', () => {
    expect(component.activeCalculator).toBe('exercise-weapons');
  });

  it('should switch calculator when setCalculator is called', () => {
    component.setCalculator('stamina');
    expect(component.activeCalculator).toBe('stamina');
  });

  it('should calculate exercise weapons correctly', () => {
    component.exerciseWeaponData.currentCharges = 10;
    component.exerciseWeaponData.maxCharges = 100;
    component.exerciseWeaponData.targetCharges = 50;
    
    component.calculateExerciseWeapons();
    
    expect(component.exerciseWeaponData.result).toBe(40);
  });

  it('should calculate stamina correctly', () => {
    component.staminaData.currentStamina = 100;
    component.staminaData.targetStamina = 200;
    
    component.calculateStamina();
    
    expect(component.staminaData.result).toBe(100);
  });

  it('should calculate charm damage correctly', () => {
    component.charmDamageData.baseDamage = 100;
    component.charmDamageData.charmLevel = 5;
    
    component.calculateCharmDamage();
    
    expect(component.charmDamageData.result).toBe(150);
  });

  it('should calculate loot split correctly', () => {
    component.lootSplitData.totalLoot = 1000;
    component.lootSplitData.participants = 4;
    
    component.calculateLootSplit();
    
    expect(component.lootSplitData.result).toBe(250);
  });

  it('should reset calculator data', () => {
    component.exerciseWeaponData.currentCharges = 10;
    component.exerciseWeaponData.maxCharges = 100;
    component.exerciseWeaponData.targetCharges = 50;
    component.exerciseWeaponData.result = 40;
    
    component.resetCalculator();
    
    expect(component.exerciseWeaponData.currentCharges).toBe(0);
    expect(component.exerciseWeaponData.maxCharges).toBe(0);
    expect(component.exerciseWeaponData.targetCharges).toBe(0);
    expect(component.exerciseWeaponData.result).toBe(0);
  });
}); 