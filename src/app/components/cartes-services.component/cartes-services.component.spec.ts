import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesServicesComponent } from './cartes-services.component';

describe('CartesServices', () => {
  let component: CartesServicesComponent;
  let fixture: ComponentFixture<CartesServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartesServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartesServicesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
