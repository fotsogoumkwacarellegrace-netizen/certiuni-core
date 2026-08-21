import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrAnalysisPage } from './ocr-analysis-page';

describe('OcrAnalysisPage', () => {
  let component: OcrAnalysisPage;
  let fixture: ComponentFixture<OcrAnalysisPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrAnalysisPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OcrAnalysisPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
