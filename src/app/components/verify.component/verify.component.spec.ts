import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyComponent } from './verify.component';

describe('Verify', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
