import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrModalComponent } from './ocr-modal';

describe('OcrModal', () => {
  let component: OcrModalComponent;
  let fixture: ComponentFixture<OcrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OcrModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
