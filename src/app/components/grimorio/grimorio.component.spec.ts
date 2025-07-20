import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrimorioComponent } from './grimorio.component';

describe('GrimorioComponent', () => {
  let component: GrimorioComponent;
  let fixture: ComponentFixture<GrimorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrimorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrimorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
