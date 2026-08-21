import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheUuidComponent } from './recherche-uuid.component';

describe('RechercheUuid', () => {
  let component: RechercheUuidComponent;
  let fixture: ComponentFixture<RechercheUuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheUuidComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheUuidComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
