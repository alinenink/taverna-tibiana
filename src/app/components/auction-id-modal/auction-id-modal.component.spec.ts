import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionIdModalComponent } from './auction-id-modal.component';

describe('ActionIdModalComponent', () => {
  let component: ActionIdModalComponent;
  let fixture: ComponentFixture<ActionIdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionIdModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
